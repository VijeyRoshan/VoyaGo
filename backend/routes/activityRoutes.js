const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authController = require('../controllers/authController');

// All activity routes are protected
router.use(authController.protect);

router.route('/')
  .get(activityController.getAllActivities)
  .post(activityController.createActivity);

router.route('/:id')
  .get(activityController.getActivity)
  .patch(activityController.updateActivity)
  .delete(activityController.deleteActivity);

module.exports = router;
