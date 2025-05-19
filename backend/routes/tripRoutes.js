const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authController = require('../controllers/authController');

// Public routes
router.get('/public', tripController.getPublicTrips);

// Protected routes
router.use(authController.protect);

router.route('/')
  .get(tripController.getAllTrips)
  .post(tripController.createTrip);

router.route('/:id')
  .get(tripController.getTrip)
  .patch(tripController.updateTrip)
  .delete(tripController.deleteTrip);

// Get all items for a specific trip
router.get('/:id/accommodations', tripController.getTripAccommodations);
router.get('/:id/transportation', tripController.getTripTransportation);
router.get('/:id/activities', tripController.getTripActivities);

// Get full itinerary for a trip (all items sorted by date)
router.get('/:id/itinerary', tripController.getTripItinerary);

module.exports = router;
