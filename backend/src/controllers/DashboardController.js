import Spot from '../models/Spot.js';

export default {
  async show(req, res) {
    const { user_id: user } = req.headers;

    const spots = await Spot.find({ user });

    return res.json(spots);
  },
};
