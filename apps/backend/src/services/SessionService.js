export class SessionService {
  constructor({ usersRepository }) {
    this._usersRepository = usersRepository
  }

  async create(email) {
    let user = await this._usersRepository.findByEmail(email)

    if (!user) {
      user = await this._usersRepository.create(email)
    }

    return user
  }
}
