import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getAccommodation, updateAccommodation } from '../services/tripService'

const EditAccommodation = () => {
  const { id: tripId, itemId: id } = useParams()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    type: 'hotel',
    address: '',
    checkInDate: '',
    checkOutDate: '',
    price: '',
    notes: '',
    bookingConfirmation: ''
  })

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        setLoading(true)
        const accommodation = await getAccommodation(id)

        // Format dates for datetime-local input
        const formatDateForInput = (dateString) => {
          const date = new Date(dateString)
          return date.toISOString().slice(0, 16)
        }

        setFormData({
          name: accommodation.name || '',
          type: accommodation.type || 'hotel',
          address: typeof accommodation.address === 'string'
            ? accommodation.address
            : accommodation.address?.street || '',
          checkInDate: formatDateForInput(accommodation.checkInDate),
          checkOutDate: formatDateForInput(accommodation.checkOutDate),
          price: accommodation.price?.amount || '',
          notes: accommodation.notes || '',
          bookingConfirmation: accommodation.bookingConfirmation || ''
        })
      } catch (error) {
        console.error('Error fetching accommodation:', error)
        toast.error('Failed to load accommodation data')
        navigate(`/trips/${tripId}`)
      } finally {
        setLoading(false)
      }
    }

    fetchAccommodation()
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
      const accommodationData = {
        name: formData.name,
        type: formData.type,
        address: {
          street: formData.address,
          city: '',
          country: ''
        },
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        price: {
          amount: formData.price ? parseFloat(formData.price) : 0,
          currency: 'USD'
        },
        notes: formData.notes,
        bookingConfirmation: formData.bookingConfirmation
      }

      await updateAccommodation(id, accommodationData)
      toast.success('Accommodation updated successfully!')
      navigate(`/trips/${tripId}`)
    } catch (error) {
      console.error('Error updating accommodation:', error)
      toast.error('Failed to update accommodation: ' + (error.response?.data?.message || error.message))
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Accommodation</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

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
              <option value="hotel">Hotel</option>
              <option value="hostel">Hostel</option>
              <option value="apartment">Apartment</option>
              <option value="resort">Resort</option>
              <option value="guesthouse">Guesthouse</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700">
                Check-in Date
              </label>
              <input
                type="datetime-local"
                id="checkInDate"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700">
                Check-out Date
              </label>
              <input
                type="datetime-local"
                id="checkOutDate"
                name="checkOutDate"
                value={formData.checkOutDate}
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
            <label htmlFor="bookingConfirmation" className="block text-sm font-medium text-gray-700">
              Booking Confirmation
            </label>
            <input
              type="text"
              id="bookingConfirmation"
              name="bookingConfirmation"
              value={formData.bookingConfirmation}
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

export default EditAccommodation
