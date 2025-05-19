const express = require('express');
const router = express.Router();
const transportationController = require('../controllers/transportationController');
const authController = require('../controllers/authController');

// All transportation routes are protected
router.use(authController.protect);

router.route('/')
  .get(transportationController.getAllTransportation)
  .post(transportationController.createTransportation);

router.route('/:id')
  .get(transportationController.getTransportation)
  .patch(transportationController.updateTransportation)
  .delete(transportationController.deleteTransportation);

module.exports = router;
