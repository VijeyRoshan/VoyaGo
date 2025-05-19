const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login API...');
    const response = await axios.post('http://localhost:5000/api/users/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Login successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Login failed!');
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status code:', error.response.status);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testLogin();
