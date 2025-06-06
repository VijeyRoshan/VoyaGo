import api from './api'

// Trip services
export const getAllTrips = async () => {
  const response = await api.get('/api/trips')
  return response.data.data.trips
}

export const getTrip = async (id) => {
  const response = await api.get(`/api/trips/${id}`)
  return response.data.data.trip
}

export const createTrip = async (tripData) => {
  const response = await api.post('/api/trips', tripData)
  return response.data.data.trip
}

export const updateTrip = async (id, tripData) => {
  const response = await api.patch(`/api/trips/${id}`, tripData)
  return response.data.data.trip
}

export const deleteTrip = async (id) => {
  await api.delete(`/api/trips/${id}`)
  return true
}

// Accommodation services
export const getTripAccommodations = async (tripId) => {
  const response = await api.get(`/api/trips/${tripId}/accommodations`)
  return response.data.data.accommodations
}

export const getAccommodation = async (id) => {
  const response = await api.get(`/api/accommodations/${id}`)
  return response.data.data.accommodation
}

export const createAccommodation = async (accommodationData) => {
  const response = await api.post('/api/accommodations', accommodationData)
  return response.data.data.accommodation
}

export const updateAccommodation = async (id, accommodationData) => {
  const response = await api.patch(`/api/accommodations/${id}`, accommodationData)
  return response.data.data.accommodation
}

export const deleteAccommodation = async (id) => {
  await api.delete(`/api/accommodations/${id}`)
  return true
}

// Transportation services
export const getTripTransportation = async (tripId) => {
  const response = await api.get(`/api/trips/${tripId}/transportation`)
  return response.data.data.transportation
}

export const getTransportation = async (id) => {
  const response = await api.get(`/api/transportation/${id}`)
  return response.data.data.transportation
}

export const createTransportation = async (transportationData) => {
  const response = await api.post('/api/transportation', transportationData)
  return response.data.data.transportation
}

export const updateTransportation = async (id, transportationData) => {
  const response = await api.patch(`/api/transportation/${id}`, transportationData)
  return response.data.data.transportation
}

export const deleteTransportation = async (id) => {
  await api.delete(`/api/transportation/${id}`)
  return true
}

// Activity services
export const getTripActivities = async (tripId) => {
  const response = await api.get(`/api/trips/${tripId}/activities`)
  return response.data.data.activities
}

export const getActivity = async (id) => {
  const response = await api.get(`/api/activities/${id}`)
  return response.data.data.activity
}

export const createActivity = async (activityData) => {
  const response = await api.post('/api/activities', activityData)
  return response.data.data.activity
}

export const updateActivity = async (id, activityData) => {
  const response = await api.patch(`/api/activities/${id}`, activityData)
  return response.data.data.activity
}

export const deleteActivity = async (id) => {
  await api.delete(`/api/activities/${id}`)
  return true
}

// Itinerary service
export const getTripItinerary = async (tripId) => {
  const response = await api.get(`/api/trips/${tripId}/itinerary`)
  return response.data.data.itinerary
}
