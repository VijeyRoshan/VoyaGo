const express = require('express');
const router = express.Router();
const accommodationController = require('../controllers/accommodationController');
const authController = require('../controllers/authController');

// All accommodation routes are protected
router.use(authController.protect);

router.route('/')
  .get(accommodationController.getAllAccommodations)
  .post(accommodationController.createAccommodation);

router.route('/:id')
  .get(accommodationController.getAccommodation)
  .patch(accommodationController.updateAccommodation)
  .delete(accommodationController.deleteAccommodation);

module.exports = router;
