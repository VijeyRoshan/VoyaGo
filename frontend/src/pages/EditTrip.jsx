import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import TripForm from '../components/TripForm'
import { getTrip, updateTrip } from '../services/tripService'

const EditTrip = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true)
        const tripData = await getTrip(id)
        setTrip(tripData)
      } catch (error) {
        console.error('Error fetching trip:', error)
        toast.error('Failed to load trip data')
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchTrip()
  }, [id, navigate])

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      console.log('Submitting trip data:', data)

      // Ensure dates are properly formatted and valid
      const startDate = data.startDate instanceof Date ? data.startDate : new Date(data.startDate);
      const endDate = data.endDate instanceof Date ? data.endDate : new Date(data.endDate);

      // Make sure endDate is at least the same as startDate
      if (endDate < startDate) {
        // Set endDate to be the same as startDate
        endDate.setDate(startDate.getDate());
        endDate.setMonth(startDate.getMonth());
        endDate.setFullYear(startDate.getFullYear());
      }

      // Format the data properly
      const formattedData = {
        ...data,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        budget: {
          amount: parseFloat(data.budget.amount) || 0,
          currency: data.budget.currency
        }
      }

      console.log('Formatted data:', formattedData);

      await updateTrip(id, formattedData)
      toast.success('Trip updated successfully!')
      navigate(`/trips/${id}`)
    } catch (error) {
      console.error('Error updating trip:', error)
      console.error('Error details:', error.response?.data || error.message)
      toast.error('Failed to update trip: ' + (error.response?.data?.message || error.message))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Trip</h1>

        {trip && (
          <TripForm
            initialData={trip}
            onSubmit={handleSubmit}
            buttonText={isSubmitting ? 'Saving...' : 'Save Changes'}
          />
        )}
      </div>
    </div>
  )
}

export default EditTrip
