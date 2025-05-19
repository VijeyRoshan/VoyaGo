const Accommodation = require('../models/accommodationModel');
const Trip = require('../models/tripModel');

// Get all accommodations for the current user
exports.getAllAccommodations = async (req, res) => {
  try {
    // Find all trips belonging to the user
    const userTrips = await Trip.find({ user: req.user.id });
    const tripIds = userTrips.map(trip => trip._id);

    // Find all accommodations for these trips
    const accommodations = await Accommodation.find({ trip: { $in: tripIds } });

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

// Get a specific accommodation
exports.getAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({
        status: 'fail',
        message: 'No accommodation found with that ID'
      });
    }

    // Check if user is authorized to view this accommodation
    const trip = await Trip.findById(accommodation.trip);
    if (trip.user.toString() !== req.user.id && !trip.isPublic) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to view this accommodation'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        accommodation
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Create a new accommodation
exports.createAccommodation = async (req, res) => {
  try {
    // Check if the trip exists and belongs to the user
    const trip = await Trip.findById(req.body.trip);
    
    if (!trip) {
      return res.status(404).json({
        status: 'fail',
        message: 'No trip found with that ID'
      });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to add accommodations to this trip'
      });
    }

    const newAccommodation = await Accommodation.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        accommodation: newAccommodation
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Update an accommodation
exports.updateAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({
        status: 'fail',
        message: 'No accommodation found with that ID'
      });
    }

    // Check if user is authorized to update this accommodation
    const trip = await Trip.findById(accommodation.trip);
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to update this accommodation'
      });
    }

    const updatedAccommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        accommodation: updatedAccommodation
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Delete an accommodation
exports.deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({
        status: 'fail',
        message: 'No accommodation found with that ID'
      });
    }

    // Check if user is authorized to delete this accommodation
    const trip = await Trip.findById(accommodation.trip);
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to delete this accommodation'
      });
    }

    await Accommodation.findByIdAndDelete(req.params.id);

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
