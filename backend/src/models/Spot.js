const { Schema, model } = require('mongoose');

const SpotSchema = new Schema(
  {
    thumbnail: String,
    company: {
      type: String,
      required: true,
    },
    price: Number,
    techs: [String],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = model('Spot', SpotSchema);
