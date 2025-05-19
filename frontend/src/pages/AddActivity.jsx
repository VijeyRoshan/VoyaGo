import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createActivity } from '../services/tripService'

const AddActivity = () => {
  const { id: tripId } = useParams()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    type: 'sightseeing',
    date: '',
    duration: '',
    location: {
      name: '',
      address: ''
    },
    price: '',
    bookingReference: '',
    notes: '',
    trip: tripId
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      
      // Format data for API
      const activityData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : undefined,
        duration: formData.duration ? parseInt(formData.duration) : undefined
      }
      
      await createActivity(activityData)
      toast.success('Activity added successfully!')
      navigate(`/trips/${tripId}`)
    } catch (error) {
      console.error('Error adding activity:', error)
      toast.error('Failed to add activity: ' + (error.response?.data?.message || error.message))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Activity</h1>
        
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
              placeholder="e.g., Visit Eiffel Tower"
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
              <option value="sightseeing">Sightseeing</option>
              <option value="tour">Tour</option>
              <option value="museum">Museum</option>
              <option value="food">Food & Dining</option>
              <option value="entertainment">Entertainment</option>
              <option value="outdoor">Outdoor</option>
              <option value="shopping">Shopping</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date & Time
              </label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 120"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location.name" className="block text-sm font-medium text-gray-700">
                Location Name
              </label>
              <input
                type="text"
                id="location.name"
                name="location.name"
                value={formData.location.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Eiffel Tower"
              />
            </div>
            
            <div>
              <label htmlFor="location.address" className="block text-sm font-medium text-gray-700">
                Location Address
              </label>
              <input
                type="text"
                id="location.address"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Champ de Mars, 5 Avenue Anatole France, 75007 Paris"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
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
                placeholder="e.g., ABC123"
              />
            </div>
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
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            ></textarea>
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
              {isSubmitting ? 'Adding...' : 'Add Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddActivity
