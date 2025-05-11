import mongoose from 'mongoose';

const { Schema, model } = mongoose;

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

export default model('Booking', BookingSchema);
