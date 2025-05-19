import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { isAuthenticated, currentUser, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="bg-primary-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            Travel Itinerary Planner
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-primary-200">
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-primary-200">
                  Dashboard
                </Link>
                <Link to="/trips/create" className="hover:text-primary-200">
                  Create Trip
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center hover:text-primary-200"
                    onClick={toggleDropdown}
                  >
                    {currentUser?.name}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-primary-100">
                        Profile
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-primary-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-200">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-primary-600 px-4 py-2 rounded-md hover:bg-primary-100">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link to="/" className="block hover:text-primary-200" onClick={toggleMenu}>
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block hover:text-primary-200" onClick={toggleMenu}>
                  Dashboard
                </Link>
                <Link to="/trips/create" className="block hover:text-primary-200" onClick={toggleMenu}>
                  Create Trip
                </Link>
                <Link to="/profile" className="block hover:text-primary-200" onClick={toggleMenu}>
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout()
                    toggleMenu()
                  }}
                  className="block w-full text-left hover:text-primary-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block hover:text-primary-200" onClick={toggleMenu}>
                  Login
                </Link>
                <Link to="/register" className="block hover:text-primary-200" onClick={toggleMenu}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
