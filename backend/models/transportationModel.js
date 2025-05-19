const mongoose = require('mongoose');

const transportationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['flight', 'train', 'bus', 'car', 'ferry', 'other'],
      required: [true, 'Transportation must have a type']
    },
    departureLocation: {
      name: String,
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    arrivalLocation: {
      name: String,
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    departureDateTime: {
      type: Date,
      required: [true, 'Transportation must have a departure date and time']
    },
    arrivalDateTime: {
      type: Date,
      required: [true, 'Transportation must have an arrival date and time'],
      validate: {
        validator: function(val) {
          return val >= this.departureDateTime;
        },
        message: 'Arrival date and time must be after departure date and time'
      }
    },
    provider: {
      name: String,
      contactInfo: String
    },
    bookingReference: String,
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
    seatInfo: String,
    notes: String,
    trip: {
      type: mongoose.Schema.ObjectId,
      ref: 'Trip',
      required: [true, 'Transportation must belong to a trip']
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

// Calculate transportation duration
transportationSchema.virtual('duration').get(function() {
  return (this.arrivalDateTime - this.departureDateTime) / (1000 * 60); // Duration in minutes
});

const Transportation = mongoose.model('Transportation', transportationSchema);

module.exports = Transportation;
