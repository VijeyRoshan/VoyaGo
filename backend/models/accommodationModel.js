const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Accommodation must have a name'],
      trim: true
    },
    type: {
      type: String,
      enum: ['hotel', 'hostel', 'apartment', 'resort', 'guesthouse', 'other'],
      default: 'hotel'
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    checkInDate: {
      type: Date,
      required: [true, 'Accommodation must have a check-in date']
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Accommodation must have a check-out date'],
      validate: {
        validator: function(val) {
          return val >= this.checkInDate;
        },
        message: 'Check-out date must be after check-in date'
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
    bookingConfirmation: String,
    notes: String,
    images: [String],
    trip: {
      type: mongoose.Schema.ObjectId,
      ref: 'Trip',
      required: [true, 'Accommodation must belong to a trip']
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

// Calculate accommodation duration
accommodationSchema.virtual('duration').get(function() {
  return Math.floor((this.checkOutDate - this.checkInDate) / (1000 * 60 * 60 * 24));
});

const Accommodation = mongoose.model('Accommodation', accommodationSchema);

module.exports = Accommodation;
