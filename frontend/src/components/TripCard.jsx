import { Link } from 'react-router-dom'
import { format } from 'date-fns'

const TripCard = ({ trip }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return format(date, 'MMM d, yyyy')
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {trip.coverImage ? (
        <img 
          src={trip.coverImage} 
          alt={trip.title} 
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-primary-200 flex items-center justify-center">
          <span className="text-primary-700 text-xl font-semibold">{trip.destination}</span>
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{trip.title}</h3>
        
        <div className="text-gray-600 mb-4">
          <div className="flex items-center mb-1">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>{trip.destination}</span>
          </div>
          
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
          </div>
        </div>
        
        {trip.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{trip.description}</p>
        )}
        
        <div className="flex justify-between items-center">
          <Link 
            to={`/trips/${trip._id}`}
            className="text-primary-600 hover:text-primary-800 font-medium"
          >
            View Details
          </Link>
          
          {trip.isPublic && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              Public
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default TripCard
