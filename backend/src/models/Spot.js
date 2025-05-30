import mongoose from 'mongoose';

const { Schema, model } = mongoose;

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
  return `${process.env.API_URL}/files/${this.thumbnail}`;
});

export default model('Spot', SpotSchema);
