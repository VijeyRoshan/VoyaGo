import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getTransportation, updateTransportation } from '../services/tripService'

const EditTransportation = () => {
  const { id: tripId, itemId: id } = useParams()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    type: 'flight',
    departureLocation: '',
    arrivalLocation: '',
    departureDateTime: '',
    arrivalDateTime: '',
    price: '',
    notes: '',
    bookingReference: '',
    confirmationNumber: ''
  })

  useEffect(() => {
    const fetchTransportation = async () => {
      try {
        setLoading(true)
        const transportation = await getTransportation(id)

        // Format dates for datetime-local input
        const formatDateForInput = (dateString) => {
          if (!dateString) return ''
          const date = new Date(dateString)
          return date.toISOString().slice(0, 16)
        }

        setFormData({
          type: transportation.type || 'flight',
          departureLocation: transportation.departureLocation?.name || '',
          arrivalLocation: transportation.arrivalLocation?.name || '',
          departureDateTime: formatDateForInput(transportation.departureDateTime),
          arrivalDateTime: formatDateForInput(transportation.arrivalDateTime),
          price: transportation.price?.amount || '',
          notes: transportation.notes || '',
          bookingReference: transportation.bookingReference || '',
          confirmationNumber: transportation.confirmationNumber || ''
        })
      } catch (error) {
        console.error('Error fetching transportation:', error)
        toast.error('Failed to load transportation data')
        navigate(`/trips/${tripId}`)
      } finally {
        setLoading(false)
      }
    }

    fetchTransportation()
  }, [id, tripId, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)

      // Format data for API
      const transportationData = {
        type: formData.type,
        departureLocation: {
          name: formData.departureLocation,
          address: formData.departureLocation
        },
        arrivalLocation: {
          name: formData.arrivalLocation,
          address: formData.arrivalLocation
        },
        departureDateTime: formData.departureDateTime,
        arrivalDateTime: formData.arrivalDateTime,
        price: {
          amount: formData.price ? parseFloat(formData.price) : 0,
          currency: 'USD'
        },
        notes: formData.notes,
        bookingReference: formData.bookingReference,
        confirmationNumber: formData.confirmationNumber
      }

      await updateTransportation(id, transportationData)
      toast.success('Transportation updated successfully!')
      navigate(`/trips/${tripId}`)
    } catch (error) {
      console.error('Error updating transportation:', error)
      toast.error('Failed to update transportation: ' + (error.response?.data?.message || error.message))
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Transportation</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="flight">Flight</option>
              <option value="train">Train</option>
              <option value="bus">Bus</option>
              <option value="car">Car</option>
              <option value="taxi">Taxi</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="departureLocation" className="block text-sm font-medium text-gray-700">
                Departure Location
              </label>
              <input
                type="text"
                id="departureLocation"
                name="departureLocation"
                value={formData.departureLocation}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="arrivalLocation" className="block text-sm font-medium text-gray-700">
                Arrival Location
              </label>
              <input
                type="text"
                id="arrivalLocation"
                name="arrivalLocation"
                value={formData.arrivalLocation}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="departureDateTime" className="block text-sm font-medium text-gray-700">
                Departure Date & Time
              </label>
              <input
                type="datetime-local"
                id="departureDateTime"
                name="departureDateTime"
                value={formData.departureDateTime}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="arrivalDateTime" className="block text-sm font-medium text-gray-700">
                Arrival Date & Time
              </label>
              <input
                type="datetime-local"
                id="arrivalDateTime"
                name="arrivalDateTime"
                value={formData.arrivalDateTime}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (USD)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="bookingReference" className="block text-sm font-medium text-gray-700">
              Booking Reference
            </label>
            <input
              type="text"
              id="bookingReference"
              name="bookingReference"
              value={formData.bookingReference}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="confirmationNumber" className="block text-sm font-medium text-gray-700">
              Confirmation Number
            </label>
            <input
              type="text"
              id="confirmationNumber"
              name="confirmationNumber"
              value={formData.confirmationNumber}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/trips/${tripId}`)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTransportation
