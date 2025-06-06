import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import TripDetails from './pages/TripDetails'
import CreateTrip from './pages/CreateTrip'
import EditTrip from './pages/EditTrip'
import AddAccommodation from './pages/AddAccommodation'
import AddTransportation from './pages/AddTransportation'
import AddActivity from './pages/AddActivity'
import EditAccommodation from './pages/EditAccommodation'
import EditTransportation from './pages/EditTransportation'
import EditActivity from './pages/EditActivity'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="trips/create" element={<CreateTrip />} />
        <Route path="trips/:id" element={<TripDetails />} />
        <Route path="trips/:id/edit" element={<EditTrip />} />
        <Route path="trips/:id/accommodations/add" element={<AddAccommodation />} />
        <Route path="trips/:id/transportation/add" element={<AddTransportation />} />
        <Route path="trips/:id/activities/add" element={<AddActivity />} />
        <Route path="trips/:id/accommodations/:itemId/edit" element={<EditAccommodation />} />
        <Route path="trips/:id/transportation/:itemId/edit" element={<EditTransportation />} />
        <Route path="trips/:id/activities/:itemId/edit" element={<EditActivity />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App
