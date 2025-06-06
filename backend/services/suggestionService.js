const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

class SuggestionService {
  constructor() {
    // Initialize Google Gemini AI
    console.log('Initializing SuggestionService...');
    console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
    console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);
    console.log('GEMINI_API_KEY starts with:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'N/A');

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      console.log('✅ Initializing Gemini AI with API key');
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } else {
      console.log('❌ Gemini API key not configured or is placeholder');
    }
  }

  // Get suggestions using Google Gemini AI
  async getGeminiSuggestions(destination, startDate, endDate, tripType = 'leisure') {
    console.log('🔍 getGeminiSuggestions called with:', { destination, startDate, endDate, tripType });

    if (!this.genAI) {
      console.log('❌ Gemini AI not initialized');
      throw new Error('Gemini API key not configured');
    }

    console.log('✅ Gemini AI is initialized, making request...');

    try {
      const prompt = `
I'm planning a ${tripType} trip to ${destination} from ${startDate} to ${endDate}.
Please provide detailed travel suggestions in the following exact JSON format (no additional text, just the JSON):

{
  "accommodations": [
    {
      "name": "Specific Hotel/Accommodation Name",
      "type": "hotel/airbnb/hostel/resort/boutique",
      "area": "Specific Neighborhood/District",
      "priceRange": "budget/mid-range/luxury",
      "description": "Detailed description with unique features",
      "amenities": ["wifi", "pool", "gym", "breakfast", "spa", "parking"],
      "rating": "4.5/5",
      "approximatePrice": "$100-200/night"
    }
  ],
  "activities": [
    {
      "name": "Specific Activity/Attraction Name",
      "type": "sightseeing/adventure/cultural/dining/shopping/entertainment",
      "duration": "1-2 hours/2-3 hours/half day/full day",
      "bestTime": "morning/afternoon/evening/anytime",
      "description": "Detailed description of what to expect",
      "estimatedCost": "Free/$10-20/$20-50/$50+",
      "location": "Specific address or area",
      "tips": "Practical tip for this activity"
    }
  ],
  "localTips": [
    "Specific practical tip about transportation",
    "Local custom or etiquette tip",
    "Money/payment tip",
    "Safety or health tip",
    "Best time to visit tip"
  ]
}

Requirements:
- Provide 4-6 real, specific accommodation options with actual names if possible
- Provide 10-15 diverse activity suggestions covering different interests including:
  * Cultural attractions (museums, landmarks, historical sites)
  * Dining experiences (restaurants, food markets, local cuisine)
  * Entertainment (shows, nightlife, events)
  * Sightseeing (viewpoints, tours, walks)
  * Shopping (markets, districts, unique stores)
  * Outdoor activities (parks, nature, sports)
- Include 5-7 practical local tips
- Focus on popular, well-reviewed places in ${destination}
- Consider the travel dates ${startDate} to ${endDate}
- Make suggestions specific to ${destination}, not generic
- Include at least 2-3 dining-related activities in the activities list
    `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('Gemini raw response:', text);

      // Clean the response to extract JSON
      let cleanedText = text.trim();

      // Remove markdown code blocks if present
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

      // Find JSON object
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsedData = JSON.parse(jsonMatch[0]);
          console.log('Successfully parsed Gemini response');
          return parsedData;
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          throw new Error('Invalid JSON response from Gemini');
        }
      } else {
        console.error('No JSON found in response');
        throw new Error('No valid JSON found in Gemini response');
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(`Failed to get AI suggestions: ${error.message}`);
    }
  }

  // Fallback suggestions when APIs are not available
  getFallbackSuggestions(destination) {
    return {
      accommodations: [
        {
          name: `Central Hotel ${destination}`,
          type: 'hotel',
          area: 'City Center',
          priceRange: 'mid-range',
          description: 'Centrally located hotel with modern amenities',
          amenities: ['wifi', 'breakfast', 'concierge']
        },
        {
          name: `Budget Inn ${destination}`,
          type: 'hostel',
          area: 'Downtown',
          priceRange: 'budget',
          description: 'Affordable accommodation for budget travelers',
          amenities: ['wifi', 'shared kitchen']
        },
        {
          name: `Luxury Resort ${destination}`,
          type: 'resort',
          area: 'Premium District',
          priceRange: 'luxury',
          description: 'High-end resort with premium facilities',
          amenities: ['wifi', 'pool', 'spa', 'gym', 'restaurant']
        }
      ],
      activities: [
        {
          name: `${destination} City Tour`,
          type: 'sightseeing',
          duration: '3-4 hours',
          bestTime: 'morning',
          description: 'Explore the main attractions and landmarks',
          estimatedCost: 'Medium'
        },
        {
          name: 'Local Food Tour',
          type: 'dining',
          duration: '2-3 hours',
          bestTime: 'evening',
          description: 'Taste authentic local cuisine',
          estimatedCost: 'Medium'
        },
        {
          name: 'Cultural Museum Visit',
          type: 'cultural',
          duration: '2 hours',
          bestTime: 'afternoon',
          description: 'Learn about local history and culture',
          estimatedCost: 'Low'
        },
        {
          name: 'Shopping District',
          type: 'shopping',
          duration: '2-4 hours',
          bestTime: 'afternoon',
          description: 'Browse local markets and shops',
          estimatedCost: 'Variable'
        },
        {
          name: 'Scenic Viewpoint',
          type: 'sightseeing',
          duration: '1-2 hours',
          bestTime: 'sunset',
          description: 'Enjoy panoramic views of the city',
          estimatedCost: 'Free'
        }
      ],
      localTips: [
        'Check local transportation options for easy getting around',
        'Learn a few basic phrases in the local language',
        'Research local customs and etiquette',
        'Keep emergency contact numbers handy'
      ]
    };
  }
}

module.exports = new SuggestionService();
