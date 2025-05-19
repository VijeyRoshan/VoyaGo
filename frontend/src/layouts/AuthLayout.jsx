import { Outlet, Link } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex justify-between items-center p-4 bg-white shadow">
        <Link to="/" className="text-2xl font-bold text-primary-600">
          Travel Itinerary Planner
        </Link>
      </div>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
      <footer className="py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Travel Itinerary Planner. All rights reserved.
      </footer>
    </div>
  )
}

export default AuthLayout
