const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Activity must have a title'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      enum: ['sightseeing', 'food', 'adventure', 'cultural', 'relaxation', 'shopping', 'entertainment', 'other'],
      default: 'other'
    },
    location: {
      name: String,
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    startDateTime: {
      type: Date,
      required: [true, 'Activity must have a start date and time']
    },
    endDateTime: {
      type: Date,
      validate: {
        validator: function(val) {
          return !val || val >= this.startDateTime;
        },
        message: 'End date and time must be after start date and time'
      }
    },
    price: {
      amount: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'USD'
      }
    },
    bookingReference: String,
    notes: String,
    images: [String],
    trip: {
      type: mongoose.Schema.ObjectId,
      ref: 'Trip',
      required: [true, 'Activity must belong to a trip']
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

// Calculate activity duration if endDateTime is provided
activitySchema.virtual('duration').get(function() {
  if (!this.endDateTime) return null;
  return (this.endDateTime - this.startDateTime) / (1000 * 60); // Duration in minutes
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
