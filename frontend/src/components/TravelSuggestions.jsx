import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { getTravelSuggestions, getApiStatus } from '../services/suggestionService'

const TravelSuggestions = ({ tripData, onSuggestionSelect }) => {
  const [suggestions, setSuggestions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('accommodations')
  const [addingItems, setAddingItems] = useState(new Set())

  useEffect(() => {
    if (tripData && tripData.destination) {
      fetchSuggestions()
    }
  }, [tripData])

  // Debug: Check API status
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const data = await getApiStatus()
        console.log('API Status:', data.apiStatus)
      } catch (error) {
        console.error('Failed to check API status:', error)
      }
    }
    checkApiStatus()
  }, [])

  const fetchSuggestions = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getTravelSuggestions(tripData)
      setSuggestions(data.suggestions)

      if (data.errors && data.errors.length > 0) {
        console.warn('Some APIs failed:', data.errors)
        toast.info(`Using ${data.suggestions.source} suggestions`)
      } else {
        toast.success('Travel suggestions loaded successfully!')
      }
    } catch (err) {
      console.error('Failed to fetch suggestions:', err)
      setError('Failed to load suggestions. Please try again.')
      toast.error('Failed to load travel suggestions')
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionSelect = async (suggestion, type) => {
    const itemKey = `${type}-${suggestion.name}`

    setAddingItems(prev => new Set([...prev, itemKey]))

    try {
      if (onSuggestionSelect) {
        await onSuggestionSelect(suggestion, type)
      }
    } finally {
      setAddingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemKey)
        return newSet
      })
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Getting travel suggestions...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchSuggestions}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!suggestions) {
    return null
  }

  const tabs = [
    { id: 'accommodations', label: 'Hotels & Stays', icon: '🏨' },
    { id: 'activities', label: 'Activities', icon: '🎯' },
    { id: 'localTips', label: 'Local Tips', icon: '💡' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          Travel Suggestions for {tripData.destination}
        </h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          Powered by {suggestions.source || 'AI'}
        </span>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'accommodations' && suggestions.accommodations && (
          <div className="grid gap-4">
            {suggestions.accommodations.map((accommodation, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{accommodation.name}</h4>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {accommodation.type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{accommodation.description}</p>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <span className="mr-2">📍</span>
                    <span>{accommodation.area}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">💰</span>
                    <span>{accommodation.priceRange}</span>
                  </div>
                  {accommodation.rating && (
                    <div className="flex items-center">
                      <span className="mr-2">⭐</span>
                      <span>{accommodation.rating}</span>
                    </div>
                  )}
                  {accommodation.approximatePrice && (
                    <div className="flex items-center">
                      <span className="mr-2">💵</span>
                      <span>{accommodation.approximatePrice}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={() => handleSuggestionSelect(accommodation, 'accommodation')}
                    disabled={addingItems.has(`accommodation-${accommodation.name}`)}
                    className="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                  >
                    {addingItems.has(`accommodation-${accommodation.name}`) ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </>
                    ) : (
                      'Add to Trip'
                    )}
                  </button>
                </div>

                {accommodation.amenities && (
                  <div className="flex flex-wrap gap-1">
                    {accommodation.amenities.map((amenity, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'activities' && suggestions.activities && (
          <div className="grid gap-4">
            {suggestions.activities.map((activity, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{activity.name}</h4>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    {activity.type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{activity.description}</p>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <span className="mr-2">⏱️</span>
                    <span>{activity.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🕐</span>
                    <span>{activity.bestTime}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">💰</span>
                    <span>{activity.estimatedCost}</span>
                  </div>
                  {activity.location && (
                    <div className="flex items-center">
                      <span className="mr-2">📍</span>
                      <span>{activity.location}</span>
                    </div>
                  )}
                </div>

                {activity.tips && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-3">
                    <p className="text-sm text-yellow-800">
                      <span className="font-medium">💡 Tip:</span> {activity.tips}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleSuggestionSelect(activity, 'activity')}
                    disabled={addingItems.has(`activity-${activity.name}`)}
                    className="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                  >
                    {addingItems.has(`activity-${activity.name}`) ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </>
                    ) : (
                      'Add to Trip'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'localTips' && suggestions.localTips && (
          <div className="space-y-3">
            {suggestions.localTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-600 mt-1">💡</span>
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t">
        <button
          onClick={fetchSuggestions}
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
        >
          🔄 Refresh Suggestions
        </button>
      </div>
    </div>
  )
}

export default TravelSuggestions
