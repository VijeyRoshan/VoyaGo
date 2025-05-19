const Activity = require('../models/activityModel');
const Trip = require('../models/tripModel');

// Get all activities for the current user
exports.getAllActivities = async (req, res) => {
  try {
    // Find all trips belonging to the user
    const userTrips = await Trip.find({ user: req.user.id });
    const tripIds = userTrips.map(trip => trip._id);

    // Find all activities for these trips
    const activities = await Activity.find({ trip: { $in: tripIds } });

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

// Get a specific activity
exports.getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        status: 'fail',
        message: 'No activity found with that ID'
      });
    }

    // Check if user is authorized to view this activity
    const trip = await Trip.findById(activity.trip);
    if (trip.user.toString() !== req.user.id && !trip.isPublic) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to view this activity'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        activity
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Create a new activity
exports.createActivity = async (req, res) => {
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
        message: 'You do not have permission to add activities to this trip'
      });
    }

    const newActivity = await Activity.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        activity: newActivity
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Update an activity
exports.updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        status: 'fail',
        message: 'No activity found with that ID'
      });
    }

    // Check if user is authorized to update this activity
    const trip = await Trip.findById(activity.trip);
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to update this activity'
      });
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
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
        activity: updatedActivity
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Delete an activity
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        status: 'fail',
        message: 'No activity found with that ID'
      });
    }

    // Check if user is authorized to delete this activity
    const trip = await Trip.findById(activity.trip);
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to delete this activity'
      });
    }

    await Activity.findByIdAndDelete(req.params.id);

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
