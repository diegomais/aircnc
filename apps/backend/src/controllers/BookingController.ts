import type { Request, Response } from 'express';
import Booking from '../models/Booking';
import Spot from '../models/Spot';
import User from '../models/User';

export default {
  async store(req: Request, res: Response) {
    const { user_id } = req.headers;
    const { spot_id } = req.params;
    const { date } = req.body;

    const spot = await Spot.findById(spot_id);

    if (!spot) {
      return res.status(400).json({ error: 'Spot does not exists.' });
    }

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' });
    }

    const booking = await Booking.create({
      user: user_id,
      spot: spot_id,
      date,
    });

    await booking.populate<{ spot: { user: string }; user: { _id: string } }>(
      'spot user'
    );

    const ownerSocket =
      req.connectedUsers[
        String((booking.spot as unknown as { user: string }).user)
      ];

    if (ownerSocket) {
      req.io.to(ownerSocket).emit('booking_request', booking);
    }

    return res.json(booking);
  },
};
