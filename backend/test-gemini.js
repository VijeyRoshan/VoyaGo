const axios = require('axios');

async function testGeminiAPI() {
  try {
    console.log('Testing Gemini API integration...');

    // Step 1: Login to get JWT token
    console.log('1. Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
      email: 'test@example.com',
      password: 'password123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful');

    // Step 2: Test API status
    console.log('\n2. Checking API status...');
    const statusResponse = await axios.get('http://localhost:5000/api/suggestions/status', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('API Status:', JSON.stringify(statusResponse.data, null, 2));

    // Step 3: Test travel suggestions with Gemini
    console.log('\n3. Testing travel suggestions...');
    const suggestionsResponse = await axios.post('http://localhost:5000/api/suggestions/travel', {
      destination: 'London,UK',
      startDate: '2024-07-01',
      endDate: '2024-07-05',
      tripType: 'leisure'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Travel Suggestions Response:');
    console.log('Status:', suggestionsResponse.data.status);
    console.log('Source:', suggestionsResponse.data.data.suggestions.source);
    console.log('Destination:', suggestionsResponse.data.data.destination);

    if (suggestionsResponse.data.data.errors) {
      console.log('❌ Errors:', suggestionsResponse.data.data.errors);
    } else {
      console.log('✅ No errors - Gemini API working!');
    }

    // Show sample data
    const suggestions = suggestionsResponse.data.data.suggestions;
    if (suggestions.accommodations && suggestions.accommodations.length > 0) {
      console.log('\nSample accommodation:', suggestions.accommodations[0].name);
    }
    if (suggestions.activities && suggestions.activities.length > 0) {
      console.log('Sample activity:', suggestions.activities[0].name);
    }

  } catch (error) {
    console.error('❌ Error testing API:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

testGeminiAPI();
