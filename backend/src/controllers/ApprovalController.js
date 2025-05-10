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
    if (!user_id) {
      return res
        .status(400)
        .json({ error: 'User ID is necessary in request headers.' });
    }

    const booking = await Booking.findById(booking_id).populate('spot');
    if (!booking) {
      return res
        .status(400)
        .json({ error: 'Reservation request does not exists.' });
    }

    if (String(booking.spot.user) !== String(user_id)) {
      return res
        .status(400)
        .json({ error: 'Access denied to accept this request.' });
    }

    booking.approved = true;

    await booking.save();

    const bookingUserSocket = req.connectedUsers[booking.user];

    if (bookingUserSocket) {
      req.io.to(bookingUserSocket).emit('booking_response', booking);
    }

    return res.json(booking);
  },
};
