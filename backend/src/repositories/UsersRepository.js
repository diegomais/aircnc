import User from '../models/User.js';

export class UsersRepository {
  async create(email) {
    return await User.create({ email });
  }

  async findByEmail(email) {
    console.log(email)
    return await User.findOne({ email });
  }
}
