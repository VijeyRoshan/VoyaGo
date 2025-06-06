import api from './api'

// Get comprehensive travel suggestions
export const getTravelSuggestions = async (tripData) => {
  try {
    console.log('Getting travel suggestions for:', tripData)
    
    const response = await api.post('/api/suggestions/travel', {
      destination: tripData.destination,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      tripType: tripData.tripType || 'leisure'
    })
    
    console.log('Travel suggestions response:', response.data)
    return response.data.data
  } catch (error) {
    console.error('Error getting travel suggestions:', error)
    throw error
  }
}

// Get specific type of suggestions
export const getSpecificSuggestions = async (destination, type, options = {}) => {
  try {
    console.log(`Getting ${type} suggestions for ${destination}`)
    
    const params = new URLSearchParams()
    if (options.startDate) params.append('startDate', options.startDate)
    if (options.endDate) params.append('endDate', options.endDate)
    
    const queryString = params.toString() ? `?${params.toString()}` : ''
    const response = await api.get(`/api/suggestions/${destination}/${type}${queryString}`)
    
    console.log(`${type} suggestions response:`, response.data)
    return response.data.data
  } catch (error) {
    console.error(`Error getting ${type} suggestions:`, error)
    throw error
  }
}

// Get API status
export const getApiStatus = async () => {
  try {
    const response = await api.get('/api/suggestions/status')
    return response.data.data
  } catch (error) {
    console.error('Error getting API status:', error)
    throw error
  }
}

// Helper functions for different suggestion types
export const getAccommodationSuggestions = (destination, options) => {
  return getSpecificSuggestions(destination, 'accommodations', options)
}

export const getActivitySuggestions = (destination, options) => {
  return getSpecificSuggestions(destination, 'activities', options)
}

export const getDiningSuggestions = (destination, options) => {
  return getSpecificSuggestions(destination, 'dining', options)
}

export const getWeatherSuggestions = (destination, options) => {
  return getSpecificSuggestions(destination, 'weather', options)
}
