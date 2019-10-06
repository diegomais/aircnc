const Booking = require('../models/Booking');

module.exports = {
  async store(req, res) {
    const { booking_id } = req.params;
    if (!booking_id) {
      return res
        .status(400)
        .json({ error: 'Booking ID is necessary in request params.' });
    }

    const { user_id } = req.headers;
    if (!booking_id) {
      return res
        .status(400)
        .json({ error: 'User ID is necessary in request headers.' });
    }

    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return res
        .status(400)
        .json({ error: 'Reservation request does not exists.' });
    }

    if (booking.spot.user !== user_id) {
      return res
        .status(400)
        .json({ error: 'Access denied to reject this request.' });
    }

    booking.approved = true;

    await booking.save();

    return res.json(booking);
  },
};
