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
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

SpotSchema.virtual('thumbnail_url').get(function() {
  return `http://192.168.2.140:3333/files/${this.thumbnail}`;
});

module.exports = model('Spot', SpotSchema);
