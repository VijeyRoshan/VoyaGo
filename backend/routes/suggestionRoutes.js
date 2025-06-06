const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestionController');
const authController = require('../controllers/authController');

// Protect all suggestion routes (require authentication)
router.use(authController.protect);

// Get comprehensive travel suggestions
router.post('/travel', suggestionController.getTravelSuggestions);

// Get specific type of suggestions
router.get('/:destination/:type', suggestionController.getSpecificSuggestions);

// Get API status and available services
router.get('/status', suggestionController.getApiStatus);

module.exports = router;
