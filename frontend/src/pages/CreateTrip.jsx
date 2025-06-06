import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import TripForm from '../components/TripForm'
import TravelSuggestions from '../components/TravelSuggestions'
import { createTrip, createAccommodation, createActivity } from '../services/tripService'

const CreateTrip = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [tripData, setTripData] = useState(null)
  const [createdTrip, setCreatedTrip] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      const newTrip = await createTrip(data)
      setCreatedTrip(newTrip)
      setTripData(data)
      toast.success('Trip created successfully!')

      // Show suggestions instead of immediately navigating
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error creating trip:', error)
      toast.error('Failed to create trip')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSuggestionSelect = async (suggestion, type) => {
    if (!createdTrip) {
      toast.error('No trip found to add suggestion to')
      return
    }

    try {
      if (type === 'accommodation') {
        // Map Gemini suggestion to accommodation format
        const accommodationData = {
          name: suggestion.name,
          type: suggestion.type || 'hotel',
          address: {
            street: suggestion.area || suggestion.location || '',
            city: tripData.destination,
            country: ''
          },
          checkInDate: tripData.startDate,
          checkOutDate: tripData.endDate,
          price: {
            amount: suggestion.approximatePrice ? parseFloat(suggestion.approximatePrice.replace(/[^0-9.-]+/g, '')) : 0,
            currency: 'USD'
          },
          notes: `${suggestion.description || ''}\n\nAmenities: ${suggestion.amenities ? suggestion.amenities.join(', ') : 'N/A'}\nRating: ${suggestion.rating || 'N/A'}`,
          bookingConfirmation: '',
          trip: createdTrip._id
        }

        await createAccommodation(accommodationData)
        toast.success(`Added ${suggestion.name} to your trip!`)
      } else if (type === 'activity') {
        // Map Gemini suggestion to activity format
        const activityData = {
          title: suggestion.name,
          description: suggestion.description || '',
          category: suggestion.type || 'sightseeing',
          location: {
            name: suggestion.location || suggestion.area || '',
            address: suggestion.location || ''
          },
          startDateTime: tripData.startDate,
          price: {
            amount: suggestion.estimatedCost ? parseFloat(suggestion.estimatedCost.replace(/[^0-9.-]+/g, '')) : 0,
            currency: 'USD'
          },
          notes: `Best time: ${suggestion.bestTime || 'Anytime'}\nDuration: ${suggestion.duration || 'N/A'}\nTip: ${suggestion.tips || 'N/A'}`,
          trip: createdTrip._id
        }

        await createActivity(activityData)
        toast.success(`Added ${suggestion.name} to your trip!`)
      }
    } catch (error) {
      console.error('Error adding suggestion to trip:', error)
      toast.error(`Failed to add ${suggestion.name}: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleContinueToTrip = () => {
    if (createdTrip) {
      navigate(`/trips/${createdTrip._id}`)
    }
  }

  const handleSkipSuggestions = () => {
    if (createdTrip) {
      navigate(`/trips/${createdTrip._id}`)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {!showSuggestions ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Trip</h1>

          <TripForm
            onSubmit={handleSubmit}
            buttonText={isSubmitting ? 'Creating...' : 'Create Trip'}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Trip Created Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Trip Created Successfully!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your trip to <strong>{tripData?.destination}</strong> has been created. Check out these personalized suggestions to enhance your travel experience!</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex space-x-3">
              <button
                onClick={handleContinueToTrip}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
              >
                Continue to Trip Details
              </button>
              <button
                onClick={handleSkipSuggestions}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-300"
              >
                Skip Suggestions
              </button>
            </div>
          </div>

          {/* Travel Suggestions */}
          <TravelSuggestions
            tripData={tripData}
            onSuggestionSelect={handleSuggestionSelect}
          />
        </div>
      )}
    </div>
  )
}

export default CreateTrip
