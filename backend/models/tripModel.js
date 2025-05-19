const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A trip must have a title'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    startDate: {
      type: Date,
      required: [true, 'A trip must have a start date']
    },
    endDate: {
      type: Date,
      required: [true, 'A trip must have an end date'],
      validate: {
        validator: function(val) {
          // 'this' points to current document on NEW document creation
          return val >= this.startDate;
        },
        message: 'End date must be after start date'
      }
    },
    destination: {
      type: String,
      required: [true, 'A trip must have a destination']
    },
    coverImage: String,
    budget: {
      amount: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'USD'
      }
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A trip must belong to a user']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual populate for accommodations, transportation, and activities
tripSchema.virtual('accommodations', {
  ref: 'Accommodation',
  foreignField: 'trip',
  localField: '_id'
});

tripSchema.virtual('transportation', {
  ref: 'Transportation',
  foreignField: 'trip',
  localField: '_id'
});

tripSchema.virtual('activities', {
  ref: 'Activity',
  foreignField: 'trip',
  localField: '_id'
});

// Calculate trip duration
tripSchema.virtual('duration').get(function() {
  return Math.floor((this.endDate - this.startDate) / (1000 * 60 * 60 * 24)) + 1;
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
