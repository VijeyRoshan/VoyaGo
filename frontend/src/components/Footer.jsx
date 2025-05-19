import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              Travel Itinerary Planner
            </h3>
            <p className="text-gray-400">
              Plan your trips with ease. Organize accommodations, transportation, and activities all in one place.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/trips/create" className="text-gray-400 hover:text-white">
                  Create Trip
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-400">
              Email: vijeyroshan11@gmail.com<br />
              Phone: +91 9042389136
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          &copy; {new Date().getFullYear()} Travel Itinerary Planner. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
