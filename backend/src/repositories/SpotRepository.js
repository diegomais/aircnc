import Spot from '../models/Spot.js';

export class SpotRepository {
  async findByUserId(user) {
    return await Spot.find({ user });
  }
}
