import axios from 'axios'

// Get the API URL from environment variables or use default
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
console.log('API URL:', apiUrl)

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000 // 10 second timeout
})

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log the full request details for debugging
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`)
    console.log('Request Headers:', config.headers)

    if (config.data) {
      console.log('Request Data:', JSON.stringify(config.data))
    }

    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    console.log('Response Data:', response.data)
    return response
  },
  (error) => {
    console.error('API Response Error:', error.message)

    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
      console.error('Headers:', error.response.headers)

      if (error.response.status === 401) {
        // Token expired or invalid
        console.log('Unauthorized access, redirecting to login')
        localStorage.removeItem('token')

        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request)
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default api
