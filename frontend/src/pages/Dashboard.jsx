import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import TripCard from '../components/TripCard'
import { getAllTrips } from '../services/tripService'

const Dashboard = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, upcoming, past

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true)
        const data = await getAllTrips()
        setTrips(data)
      } catch (error) {
        console.error('Error fetching trips:', error)
        toast.error('Failed to load trips')
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [])

  const filteredTrips = () => {
    const now = new Date()
    
    switch (filter) {
      case 'upcoming':
        return trips.filter(trip => new Date(trip.startDate) > now)
      case 'past':
        return trips.filter(trip => new Date(trip.endDate) < now)
      case 'current':
        return trips.filter(
          trip => 
            new Date(trip.startDate) <= now && 
            new Date(trip.endDate) >= now
        )
      default:
        return trips
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Trips</h1>
        <Link
          to="/trips/create"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition duration-200"
        >
          Create New Trip
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2 border-b border-gray-200">
          <button
            className={`px-4 py-2 ${
              filter === 'all'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setFilter('all')}
          >
            All Trips
          </button>
          <button
            className={`px-4 py-2 ${
              filter === 'upcoming'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 ${
              filter === 'current'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setFilter('current')}
          >
            Current
          </button>
          <button
            className={`px-4 py-2 ${
              filter === 'past'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setFilter('past')}
          >
            Past
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredTrips().length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips().map(trip => (
            <TripCard key={trip._id} trip={trip} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-700 mb-2">No trips found</h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all'
              ? "You haven't created any trips yet."
              : `You don't have any ${filter} trips.`}
          </p>
          <Link
            to="/trips/create"
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition duration-200"
          >
            Create Your First Trip
          </Link>
        </div>
      )}
    </div>
  )
}

export default Dashboard
