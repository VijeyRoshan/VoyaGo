import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import TripForm from '../components/TripForm'
import { createTrip } from '../services/tripService'

const CreateTrip = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      const newTrip = await createTrip(data)
      toast.success('Trip created successfully!')
      navigate(`/trips/${newTrip._id}`)
    } catch (error) {
      console.error('Error creating trip:', error)
      toast.error('Failed to create trip')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Trip</h1>
        
        <TripForm 
          onSubmit={handleSubmit} 
          buttonText={isSubmitting ? 'Creating...' : 'Create Trip'} 
        />
      </div>
    </div>
  )
}

export default CreateTrip
