import Spot from '../models/Spot';

export class SpotsRepository {
  async findByUserId(userId: string) {
    return Spot.find({ user: userId });
  }
}
