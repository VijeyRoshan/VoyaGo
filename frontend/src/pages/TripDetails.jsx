import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import {
  getTrip,
  getTripItinerary,
  deleteTrip,
  deleteAccommodation,
  deleteActivity,
  deleteTransportation
} from '../services/tripService'

const TripDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [itinerary, setItinerary] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true)
        const tripData = await getTrip(id)
        setTrip(tripData)

        const itineraryData = await getTripItinerary(id)
        setItinerary(itineraryData)
      } catch (error) {
        console.error('Error fetching trip details:', error)
        toast.error('Failed to load trip details')
      } finally {
        setLoading(false)
      }
    }

    fetchTripData()
  }, [id])

  const handleDeleteTrip = async () => {
    try {
      await deleteTrip(id)
      toast.success('Trip deleted successfully')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error deleting trip:', error)
      toast.error('Failed to delete trip')
    }
  }

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to delete this ${item.type}?`)) {
      return
    }

    try {
      if (item.type === 'accommodation') {
        await deleteAccommodation(item.data._id)
      } else if (item.type === 'activity') {
        await deleteActivity(item.data._id)
      } else if (item.type === 'transportation') {
        await deleteTransportation(item.data._id)
      }

      toast.success(`${item.type.charAt(0).toUpperCase() + item.type.slice(1)} deleted successfully`)

      // Refresh the itinerary
      const itineraryData = await getTripItinerary(id)
      setItinerary(itineraryData)
    } catch (error) {
      console.error(`Error deleting ${item.type}:`, error)
      toast.error(`Failed to delete ${item.type}`)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return format(date, 'MMM d, yyyy')
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return format(date, 'MMM d, yyyy h:mm a')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Trip not found</h2>
        <Link to="/dashboard" className="text-primary-600 hover:text-primary-800">
          Return to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Trip Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{trip.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span className="font-medium">{trip.destination}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-4">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                ({trip.duration} days)
              </span>
            </div>
            {trip.description && (
              <p className="text-gray-600 mb-4">{trip.description}</p>
            )}
            {trip.budget?.amount > 0 && (
              <div className="text-gray-600">
                <span className="font-medium">Budget: </span>
                {trip.budget.amount} {trip.budget.currency}
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Link
              to={`/trips/${id}/edit`}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition duration-200"
            >
              Edit Trip
            </Link>
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleDeleteTrip}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Itinerary Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Itinerary</h2>
          <div className="flex space-x-2">
            <Link
              to={`/trips/${id}/accommodations/add`}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition duration-200"
            >
              Add Accommodation
            </Link>
            <Link
              to={`/trips/${id}/transportation/add`}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition duration-200"
            >
              Add Transportation
            </Link>
            <Link
              to={`/trips/${id}/activities/add`}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition duration-200"
            >
              Add Activity
            </Link>
          </div>
        </div>

        {itinerary.length > 0 ? (
          <div className="space-y-4">
            {itinerary.map((item, index) => (
              <div key={index} className="border-l-4 border-primary-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-gray-500">
                      {formatDateTime(item.date)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.type === 'accommodation' && item.data.name}
                      {item.type === 'transportation' && `${item.data.type} from ${item.data.departureLocation?.name || 'Unknown'} to ${item.data.arrivalLocation?.name || 'Unknown'}`}
                      {item.type === 'activity' && item.data.title}
                    </h3>
                    <div className="text-gray-600">
                      {item.type === 'accommodation' && (
                        <span>Check-in: {formatDate(item.data.checkInDate)} | Check-out: {formatDate(item.data.checkOutDate)}</span>
                      )}
                      {item.type === 'transportation' && (
                        <span>Departure: {formatDateTime(item.data.departureDateTime)} | Arrival: {formatDateTime(item.data.arrivalDateTime)}</span>
                      )}
                      {item.type === 'activity' && (
                        <span>{item.data.location?.name || item.data.location?.address || 'No location specified'}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/trips/${id}/${item.type === 'activity' ? 'activities' : item.type === 'accommodation' ? 'accommodations' : 'transportation'}/${item.data._id}/edit`}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No itinerary items yet</h3>
            <p className="text-gray-500 mb-4">
              Start building your itinerary by adding accommodations, transportation, or activities.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TripDetails
