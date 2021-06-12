const { Schema, model } = require('mongoose');

const BookingSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    spot: {
      type: Schema.Types.ObjectId,
      ref: 'Spot',
    },
    approved: Boolean,
  },
  { timestamps: true }
);

module.exports = model('Booking', BookingSchema);
