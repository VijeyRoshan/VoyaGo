const Trip = require('../models/tripModel');
const Accommodation = require('../models/accommodationModel');
const Transportation = require('../models/transportationModel');
const Activity = require('../models/activityModel');

// Get all trips for the current user
exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id });

    res.status(200).json({
      status: 'success',
      results: trips.length,
      data: {
        trips
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Get public trips
exports.getPublicTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ isPublic: true });

    res.status(200).json({
      status: 'success',
      results: trips.length,
      data: {
        trips
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Get a specific trip
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        status: 'fail',
        message: 'No trip found with that ID'
      });
    }

    // Check if user is authorized to view this trip
    if (trip.user.toString() !== req.user.id && !trip.isPublic) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to view this trip'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        trip
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Create a new trip
exports.createTrip = async (req, res) => {
  try {
    // Add user to request body
    req.body.user = req.user.id;

    const newTrip = await Trip.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        trip: newTrip
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Update a trip
exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        status: 'fail',
        message: 'No trip found with that ID'
      });
    }

    // Check if user is authorized to update this trip
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to update this trip'
      });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        trip: updatedTrip
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Delete a trip
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        status: 'fail',
        message: 'No trip found with that ID'
      });
    }

    // Check if user is authorized to delete this trip
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to delete this trip'
      });
    }

    await Trip.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Get all accommodations for a trip
exports.getTripAccommodations = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        status: 'fail',
        message: 'No trip found with that ID'
      });
    }

    // Check if user is authorized to view this trip
    if (trip.user.toString() !== req.user.id && !trip.isPublic) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to view this trip'
      });
    }

    const accommodations = await Accommodation.find({ trip: req.params.id });

    res.status(200).json({
      status: 'success',
      results: accommodations.length,
      data: {
        accommodations
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Get all transportation for a trip
exports.getTripTransportation = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        status: 'fail',
        message: 'No trip found with that ID'
      });
    }

    // Check if user is authorized to view this trip
    if (trip.user.toString() !== req.user.id && !trip.isPublic) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to view this trip'
      });
    }

    const transportation = await Transportation.find({ trip: req.params.id });

    res.status(200).json({
      status: 'success',
      results: transportation.length,
      data: {
        transportation
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Get all activities for a trip
exports.getTripActivities = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        status: 'fail',
        message: 'No trip found with that ID'
      });
    }

    // Check if user is authorized to view this trip
    if (trip.user.toString() !== req.user.id && !trip.isPublic) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to view this trip'
      });
    }

    const activities = await Activity.find({ trip: req.params.id });

    res.status(200).json({
      status: 'success',
      results: activities.length,
      data: {
        activities
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Get full itinerary for a trip (all items sorted by date)
exports.getTripItinerary = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        status: 'fail',
        message: 'No trip found with that ID'
      });
    }

    // Check if user is authorized to view this trip
    if (trip.user.toString() !== req.user.id && !trip.isPublic) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to view this trip'
      });
    }

    // Get all items for this trip
    const accommodations = await Accommodation.find({ trip: req.params.id });
    const transportation = await Transportation.find({ trip: req.params.id });
    const activities = await Activity.find({ trip: req.params.id });

    // Create itinerary items with type and date
    const itineraryItems = [
      ...accommodations.map(item => ({
        type: 'accommodation',
        date: item.checkInDate,
        data: item
      })),
      ...transportation.map(item => ({
        type: 'transportation',
        date: item.departureDateTime,
        data: item
      })),
      ...activities.map(item => ({
        type: 'activity',
        date: item.startDateTime,
        data: item
      }))
    ];

    // Sort by date
    itineraryItems.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({
      status: 'success',
      results: itineraryItems.length,
      data: {
        itinerary: itineraryItems
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};
