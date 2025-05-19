const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/userModel');

// Load environment variables
dotenv.config();

async function createTestUser() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Test user already exists, updating password...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('password123', 12);
      
      // Update the user
      await User.findByIdAndUpdate(existingUser._id, {
        password: hashedPassword
      });
      
      console.log('Test user password updated');
    } else {
      console.log('Creating new test user...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('password123', 12);
      
      // Create a new user
      const newUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      });
      
      await newUser.save();
      console.log('Test user created successfully');
    }
    
    console.log('Test user credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createTestUser();
