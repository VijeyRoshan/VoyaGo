import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'

const Register = () => {
  const { register: registerUser, error } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const password = watch('password', '')

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      console.log('Submitting registration form with:', data)

      // Use actual form data for registration
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        passwordConfirm: data.passwordConfirm
      };

      const success = await registerUser(userData);

      if (success) {
        console.log('Registration successful, navigating to dashboard');
        toast.success('Registration successful!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        console.error('Registration failed with error:', error);
        toast.error(error || 'Registration failed');
      }
    } catch (err) {
      console.error('Exception during registration:', err);
      toast.error('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Create an account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="passwordConfirm"
            type="password"
            className={`w-full px-3 py-2 border rounded-md ${errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'}`}
            {...register('passwordConfirm', {
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
          />
          {errors.passwordConfirm && (
            <p className="mt-1 text-sm text-red-600">{errors.passwordConfirm.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition duration-200 disabled:opacity-70"
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
