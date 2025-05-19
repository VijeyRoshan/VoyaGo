import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchCurrentUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/api/users/me')
      setCurrentUser(response.data.data.user)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Error fetching user:', error)
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      console.log('Attempting login with:', { email })

      // Clear any existing token first
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']

      console.log('Sending login request to:', '/api/users/login')
      console.log('With credentials:', { email, password })

      const response = await api.post('/api/users/login', { email, password })
      console.log('Login response:', response.data)

      // Check if we have a valid token in the response
      if (!response.data.token) {
        console.error('No token received in login response')
        setError('Authentication failed - no token received')
        return false
      }

      const { token, data } = response.data

      // Store token and set auth header
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      console.log('Token stored in localStorage and set in API headers')

      // Update state
      setCurrentUser(data.user)
      setIsAuthenticated(true)
      console.log('User authenticated successfully:', data.user.name)
      return true
    } catch (error) {
      console.error('Login error:', error)

      if (error.response) {
        console.error('Error status:', error.response.status)
        console.error('Error data:', error.response.data)
        setError(error.response.data?.message || 'Login failed')
      } else if (error.request) {
        console.error('No response received:', error.request)
        setError('No response from server. Please check your connection.')
      } else {
        console.error('Error message:', error.message)
        setError('An error occurred during login')
      }

      return false
    }
  }

  const register = async (userData) => {
    try {
      setError(null)
      const response = await api.post('/api/users/signup', userData)
      const { token, data } = response.data

      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      setCurrentUser(data.user)
      setIsAuthenticated(true)
      return true
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed')
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  const updateProfile = async (userData) => {
    try {
      setError(null)
      const response = await api.patch('/api/users/updateMe', userData)
      setCurrentUser(response.data.data.user)
      return true
    } catch (error) {
      setError(error.response?.data?.message || 'Profile update failed')
      return false
    }
  }

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
