const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');

// Load environment variables
dotenv.config({ path: '../.env' });

// MongoDB connection string
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://VijeyRoshan:lh44@cluster0.8coci.mongodb.net/travel-itinerary-planner?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000,
    socketTimeoutMS: 60000,
    connectTimeoutMS: 60000,
    writeConcern: { w: 'majority' }
  })
  .then(() => console.log('Connected to MongoDB Atlas successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Create test user
const createTestUser = async () => {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Test user already exists:', existingUser.email);
      process.exit(0);
    }
    
    // Create new test user
    const newUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      passwordConfirm: 'password123'
    });
    
    console.log('Test user created successfully:', newUser.email);
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

// Run the function
createTestUser();
