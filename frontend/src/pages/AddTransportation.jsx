import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createTransportation } from '../services/tripService'

const AddTransportation = () => {
  const { id: tripId } = useParams()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: 'flight',
    departureDateTime: '',
    arrivalDateTime: '',
    departureLocation: {
      name: '',
      address: ''
    },
    arrivalLocation: {
      name: '',
      address: ''
    },
    provider: '',
    bookingReference: '',
    price: '',
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
      const transportationData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : undefined
      }
      
      await createTransportation(transportationData)
      toast.success('Transportation added successfully!')
      navigate(`/trips/${tripId}`)
    } catch (error) {
      console.error('Error adding transportation:', error)
      toast.error('Failed to add transportation: ' + (error.response?.data?.message || error.message))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Transportation</h1>
        
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
              <option value="ferry">Ferry</option>
              <option value="other">Other</option>
            </select>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="departureLocation.name" className="block text-sm font-medium text-gray-700">
                Departure Location Name
              </label>
              <input
                type="text"
                id="departureLocation.name"
                name="departureLocation.name"
                value={formData.departureLocation.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., JFK Airport"
              />
            </div>
            
            <div>
              <label htmlFor="departureLocation.address" className="block text-sm font-medium text-gray-700">
                Departure Address
              </label>
              <input
                type="text"
                id="departureLocation.address"
                name="departureLocation.address"
                value={formData.departureLocation.address}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Queens, NY 11430"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="arrivalLocation.name" className="block text-sm font-medium text-gray-700">
                Arrival Location Name
              </label>
              <input
                type="text"
                id="arrivalLocation.name"
                name="arrivalLocation.name"
                value={formData.arrivalLocation.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., LAX Airport"
              />
            </div>
            
            <div>
              <label htmlFor="arrivalLocation.address" className="block text-sm font-medium text-gray-700">
                Arrival Address
              </label>
              <input
                type="text"
                id="arrivalLocation.address"
                name="arrivalLocation.address"
                value={formData.arrivalLocation.address}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Los Angeles, CA 90045"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
                Provider
              </label>
              <input
                type="text"
                id="provider"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Delta Airlines"
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
              {isSubmitting ? 'Adding...' : 'Add Transportation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTransportation
