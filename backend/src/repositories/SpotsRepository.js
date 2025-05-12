import Spot from '../models/Spot.js';

export class SpotsRepository {
  async findByUserId(user) {
    return await Spot.find({ user });
  }
}
