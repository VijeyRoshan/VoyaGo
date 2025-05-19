import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div>
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Plan Your Perfect Trip with Ease
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Organize your travel itineraries, accommodations, transportation, and activities all in one place.
          </p>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="bg-white text-primary-600 px-6 py-3 rounded-md font-medium text-lg hover:bg-gray-100 transition duration-200"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/login"
                className="bg-white text-primary-600 px-6 py-3 rounded-md font-medium text-lg hover:bg-gray-100 transition duration-200"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-medium text-lg hover:bg-white hover:text-primary-600 transition duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Travel Planner?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Itineraries</h3>
              <p className="text-gray-600">
                Create detailed day-by-day itineraries with all your travel plans in one place.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track All Details</h3>
              <p className="text-gray-600">
                Keep track of accommodations, transportation, and activities with all important details.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Time Planning</h3>
              <p className="text-gray-600">
                Streamline your travel planning process and spend more time enjoying your trip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Plan Your Next Adventure?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who use our platform to create memorable trips.
          </p>
          {isAuthenticated ? (
            <Link
              to="/trips/create"
              className="bg-primary-600 text-white px-6 py-3 rounded-md font-medium text-lg hover:bg-primary-700 transition duration-200"
            >
              Create a New Trip
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-primary-600 text-white px-6 py-3 rounded-md font-medium text-lg hover:bg-primary-700 transition duration-200"
            >
              Get Started for Free
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
