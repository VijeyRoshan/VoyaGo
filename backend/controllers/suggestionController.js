const suggestionService = require('../services/suggestionService');

// Get travel suggestions for a destination
exports.getTravelSuggestions = async (req, res) => {
  try {
    const { destination, startDate, endDate, tripType } = req.body;

    if (!destination) {
      return res.status(400).json({
        status: 'fail',
        message: 'Destination is required'
      });
    }

    console.log(`Getting suggestions for ${destination} from ${startDate} to ${endDate}`);

    let suggestions = {};
    let errors = [];

    // Use only Gemini AI for suggestions
    try {
      console.log('Getting Gemini AI suggestions...');
      suggestions = await suggestionService.getGeminiSuggestions(
        destination,
        startDate,
        endDate,
        tripType || 'leisure'
      );
      suggestions.source = 'gemini';
      console.log('Successfully got Gemini suggestions');
    } catch (geminiError) {
      console.log('Gemini AI failed:', geminiError.message);
      errors.push(`Gemini AI: ${geminiError.message}`);

      // Use fallback suggestions only if Gemini fails
      console.log('Using fallback suggestions...');
      suggestions = suggestionService.getFallbackSuggestions(destination);
      suggestions.source = 'fallback';
    }

    res.status(200).json({
      status: 'success',
      data: {
        destination,
        suggestions,
        errors: errors.length > 0 ? errors : undefined,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error getting travel suggestions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get travel suggestions',
      error: error.message
    });
  }
};

// Get specific type of suggestions (accommodations, activities, etc.)
exports.getSpecificSuggestions = async (req, res) => {
  try {
    const { destination, type } = req.params;
    const { startDate, endDate } = req.query;

    if (!destination || !type) {
      return res.status(400).json({
        status: 'fail',
        message: 'Destination and type are required'
      });
    }

    let suggestions = {};

    switch (type.toLowerCase()) {
      case 'accommodations':
        try {
          const fullSuggestions = await suggestionService.getGeminiSuggestions(destination, startDate, endDate);
          suggestions = { accommodations: fullSuggestions.accommodations };
        } catch (error) {
          const fallback = suggestionService.getFallbackSuggestions(destination);
          suggestions = { accommodations: fallback.accommodations };
        }
        break;

      case 'activities':
        try {
          const fullSuggestions = await suggestionService.getGeminiSuggestions(destination, startDate, endDate);
          suggestions = { activities: fullSuggestions.activities };
        } catch (error) {
          const fallback = suggestionService.getFallbackSuggestions(destination);
          suggestions = { activities: fallback.activities };
        }
        break;

      case 'dining':
        try {
          const fullSuggestions = await suggestionService.getGeminiSuggestions(destination, startDate, endDate);
          // Extract dining-related activities from Gemini suggestions
          const diningActivities = fullSuggestions.activities ?
            fullSuggestions.activities.filter(activity =>
              activity.type && activity.type.toLowerCase().includes('dining')
            ) : [];
          suggestions = { dining: diningActivities };
        } catch (error) {
          suggestions = { dining: [{ name: 'Local Restaurant', type: 'dining', description: 'Explore local cuisine' }] };
        }
        break;

      case 'weather':
        try {
          // Use Gemini for weather-based suggestions instead of OpenWeather API
          const fullSuggestions = await suggestionService.getGeminiSuggestions(destination, startDate, endDate);
          suggestions = { weather: {
            message: 'Weather-based suggestions included in activities',
            activities: fullSuggestions.activities
          }};
        } catch (error) {
          suggestions = { weather: { message: 'Weather data not available' } };
        }
        break;

      default:
        return res.status(400).json({
          status: 'fail',
          message: 'Invalid suggestion type. Use: accommodations, activities, dining, or weather'
        });
    }

    res.status(200).json({
      status: 'success',
      data: {
        destination,
        type,
        suggestions,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error getting specific suggestions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get suggestions',
      error: error.message
    });
  }
};

// Get API status and available services
exports.getApiStatus = async (req, res) => {
  try {
    const status = {
      gemini: {
        available: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
        description: 'AI-powered comprehensive travel suggestions (Primary source for all recommendations)'
      },
      fallback: {
        available: true,
        description: 'Default suggestions when Gemini API is unavailable'
      }
    };

    res.status(200).json({
      status: 'success',
      data: {
        apiStatus: status,
        message: 'Application configured to use Gemini AI for all travel suggestions'
      }
    });

  } catch (error) {
    console.error('Error getting API status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get API status',
      error: error.message
    });
  }
};
