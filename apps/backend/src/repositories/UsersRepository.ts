import User from '../models/User';

export class UsersRepository {
  async create(email: string) {
    return User.create({ email });
  }

  async findByEmail(email: string) {
    return User.findOne({ email });
  }
}
