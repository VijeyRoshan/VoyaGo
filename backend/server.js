const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Debug environment variables
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT || 5000);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

// Set default JWT_SECRET if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'simplekey123456789';
  console.log('Using default JWT_SECRET');
}

// Set default JWT_EXPIRES_IN if not provided
if (!process.env.JWT_EXPIRES_IN) {
  process.env.JWT_EXPIRES_IN = '90d';
  console.log('Using default JWT_EXPIRES_IN');
}

// Import routes
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');
const accommodationRoutes = require('./routes/accommodationRoutes');
const transportationRoutes = require('./routes/transportationRoutes');
const activityRoutes = require('./routes/activityRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
// Parse the MongoDB URI to ensure it's correct
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://VijeyRoshan:lh44@cluster0.8coci.mongodb.net/travel-itinerary-planner?retryWrites=true&w=majority';
console.log('Attempting to connect to MongoDB...');

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000, // Increase timeout to 60 seconds
    socketTimeoutMS: 60000,
    connectTimeoutMS: 60000,
    writeConcern: { w: 'majority' }
  })
  .then(() => console.log('Connected to MongoDB Atlas successfully'))
  .catch((err) => {
    console.error('MongoDB connection error details:', err);
    console.error('Connection string used (redacted):',
      mongoURI ? mongoURI.replace(/:([^:@]+)@/, ':****@') : 'undefined');
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/transportation', transportationRoutes);
app.use('/api/activities', activityRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Travel Itinerary Planner API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
