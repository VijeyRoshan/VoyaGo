import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const { currentUser, updateProfile } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || ''
    }
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const success = await updateProfile(data)
      if (success) {
        toast.success('Profile updated successfully!')
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      toast.error('An error occurred while updating profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition duration-200 disabled:opacity-70"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Change Password</h2>
          
          <p className="text-gray-600 mb-4">
            To change your password, please use the form below:
          </p>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <button
                type="submit"
                className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition duration-200"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
