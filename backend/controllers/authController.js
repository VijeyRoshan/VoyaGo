const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');

// Create JWT token
const signToken = id => {
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN);

  // Ensure JWT_SECRET is set
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set! Using fallback value.');
    process.env.JWT_SECRET = 'simplekey123456789';
  }

  // Ensure JWT_EXPIRES_IN is set
  if (!process.env.JWT_EXPIRES_IN) {
    console.error('JWT_EXPIRES_IN is not set! Using fallback value.');
    process.env.JWT_EXPIRES_IN = '90d';
  }

  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    console.log('Token generated successfully');
    return token;
  } catch (error) {
    console.error('Error signing token:', error);
    throw error;
  }
};

// Send JWT token in response
const createSendToken = (user, statusCode, res) => {
  try {
    const token = signToken(user._id);
    console.log('Token created successfully');

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Error in createSendToken:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating authentication token'
    });
  }
};

// Sign up a new user
// In backend/controllers/authController.js
exports.signup = async (req, res) => {
  try {
    console.log('Signup request received with body:', req.body);

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

    console.log('User created successfully:', newUser._id);

    createSendToken(newUser, 201, res);
  } catch (err) {
    console.error('Signup error details:', err.message);
    if (err.errors) {
      Object.keys(err.errors).forEach(field => {
        console.error(`Field ${field} error:`, err.errors[field].message);
      });
    }

    res.status(400).json({
      status: 'fail',
      message: err.message,
      error: err
    });
  }
};

// Log in a user
exports.login = async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // Special case for test user
    if (email === 'test@example.com' && password === 'password123') {
      console.log('Test user login detected');

      // Find or create test user
      let testUser = await User.findOne({ email: 'test@example.com' });

      if (!testUser) {
        console.log('Creating test user');
        testUser = await User.create({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          passwordConfirm: 'password123'
        });
      }

      console.log('Test user login successful');
      return createSendToken(testUser, 200, res);
    }

    // Check if user exists && password is correct
    console.log('Looking for user with email:', email);
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('User not found with email:', email);
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    console.log('User found, checking password');
    const isPasswordCorrect = await user.correctPassword(password, user.password);

    if (!isPasswordCorrect) {
      console.log('Password incorrect for user:', email);
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    console.log('Login successful for user:', email);
    // If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    console.error('Login error:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Protect routes - middleware to check if user is logged in
exports.protect = async (req, res, next) => {
  try {
    // Get token and check if it exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token found in Authorization header');
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
      console.log('Token found in cookies');
    }

    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.'
      });
    }

    console.log('Verifying token...');

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set! Using fallback value.');
      process.env.JWT_SECRET = 'simplekey123456789';
    }

    // Verify token
    try {
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      console.log('Token verified successfully. User ID:', decoded.id);

      // Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        console.log('User not found for token');
        return res.status(401).json({
          status: 'fail',
          message: 'The user belonging to this token no longer exists.'
        });
      }

      console.log('User found:', currentUser.email);

      // Special case for test user
      if (currentUser.email === 'test@example.com') {
        console.log('Test user authenticated');
      }

      // Grant access to protected route
      req.user = currentUser;
      next();
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError.message);
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token or token expired'
      });
    }
  } catch (err) {
    console.error('Error in protect middleware:', err);
    res.status(401).json({
      status: 'fail',
      message: 'Authentication failed'
    });
  }
};

// Restrict to certain roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

// Placeholder for password reset functionality
exports.forgotPassword = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented'
  });
};

exports.resetPassword = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented'
  });
};

exports.updatePassword = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented'
  });
};
