const User = require('../models/User');
const Spot = require('../models/Spot');

module.exports = {
  async store(req, res) {
    const { filename: thumbnail } = req.file;
    const { company, techs, price } = req.body;
    const { user_id } = req.headers;

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' });
    }

    const spot = await Spot.create({
      user: user_id,
      thumbnail,
      company,
      techs: techs.split(',').map(tech => tech.trim()),
      price,
    });

    return res.send(spot);
  },
};
