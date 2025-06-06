import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getActivity, updateActivity } from '../services/tripService'

const EditActivity = () => {
  const { id: tripId, itemId: id } = useParams()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'sightseeing',
    location: '',
    startDateTime: '',
    endDateTime: '',
    price: '',
    notes: '',
    bookingReference: ''
  })

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true)
        const activity = await getActivity(id)

        // Format dates for datetime-local input
        const formatDateForInput = (dateString) => {
          if (!dateString) return ''
          const date = new Date(dateString)
          return date.toISOString().slice(0, 16)
        }

        setFormData({
          title: activity.title || '',
          description: activity.description || '',
          category: activity.category || 'sightseeing',
          location: activity.location?.name || activity.location?.address || '',
          startDateTime: formatDateForInput(activity.startDateTime),
          endDateTime: formatDateForInput(activity.endDateTime),
          price: activity.price?.amount || '',
          notes: activity.notes || '',
          bookingReference: activity.bookingReference || ''
        })
      } catch (error) {
        console.error('Error fetching activity:', error)
        toast.error('Failed to load activity data')
        navigate(`/trips/${tripId}`)
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
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
      const activityData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: {
          name: formData.location,
          address: formData.location
        },
        startDateTime: formData.startDateTime,
        endDateTime: formData.endDateTime || undefined,
        price: {
          amount: formData.price ? parseFloat(formData.price) : 0,
          currency: 'USD'
        },
        notes: formData.notes,
        bookingReference: formData.bookingReference
      }

      await updateActivity(id, activityData)
      toast.success('Activity updated successfully!')
      navigate(`/trips/${tripId}`)
    } catch (error) {
      console.error('Error updating activity:', error)
      toast.error('Failed to update activity: ' + (error.response?.data?.message || error.message))
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Activity</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="sightseeing">Sightseeing</option>
              <option value="food">Food</option>
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
              <option value="relaxation">Relaxation</option>
              <option value="shopping">Shopping</option>
              <option value="entertainment">Entertainment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDateTime" className="block text-sm font-medium text-gray-700">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                id="startDateTime"
                name="startDateTime"
                value={formData.startDateTime}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="endDateTime" className="block text-sm font-medium text-gray-700">
                End Date & Time (Optional)
              </label>
              <input
                type="datetime-local"
                id="endDateTime"
                name="endDateTime"
                value={formData.endDateTime}
                onChange={handleChange}
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

export default EditActivity
