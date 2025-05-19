const Transportation = require('../models/transportationModel');
const Trip = require('../models/tripModel');

// Get all transportation for the current user
exports.getAllTransportation = async (req, res) => {
  try {
    // Find all trips belonging to the user
    const userTrips = await Trip.find({ user: req.user.id });
    const tripIds = userTrips.map(trip => trip._id);

    // Find all transportation for these trips
    const transportation = await Transportation.find({ trip: { $in: tripIds } });

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

// Get a specific transportation
exports.getTransportation = async (req, res) => {
  try {
    const transportation = await Transportation.findById(req.params.id);

    if (!transportation) {
      return res.status(404).json({
        status: 'fail',
        message: 'No transportation found with that ID'
      });
    }

    // Check if user is authorized to view this transportation
    const trip = await Trip.findById(transportation.trip);
    if (trip.user.toString() !== req.user.id && !trip.isPublic) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to view this transportation'
      });
    }

    res.status(200).json({
      status: 'success',
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

// Create a new transportation
exports.createTransportation = async (req, res) => {
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
        message: 'You do not have permission to add transportation to this trip'
      });
    }

    const newTransportation = await Transportation.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        transportation: newTransportation
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Update a transportation
exports.updateTransportation = async (req, res) => {
  try {
    const transportation = await Transportation.findById(req.params.id);

    if (!transportation) {
      return res.status(404).json({
        status: 'fail',
        message: 'No transportation found with that ID'
      });
    }

    // Check if user is authorized to update this transportation
    const trip = await Trip.findById(transportation.trip);
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to update this transportation'
      });
    }

    const updatedTransportation = await Transportation.findByIdAndUpdate(
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
        transportation: updatedTransportation
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Delete a transportation
exports.deleteTransportation = async (req, res) => {
  try {
    const transportation = await Transportation.findById(req.params.id);

    if (!transportation) {
      return res.status(404).json({
        status: 'fail',
        message: 'No transportation found with that ID'
      });
    }

    // Check if user is authorized to delete this transportation
    const trip = await Trip.findById(transportation.trip);
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to delete this transportation'
      });
    }

    await Transportation.findByIdAndDelete(req.params.id);

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
