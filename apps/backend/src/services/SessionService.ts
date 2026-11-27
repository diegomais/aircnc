export class SessionService {
  private readonly _usersRepository: {
    findByEmail(email: string): Promise<any>;
    create(email: string): Promise<any>;
  };

  constructor({
    usersRepository,
  }: {
    usersRepository: SessionService['_usersRepository'];
  }) {
    this._usersRepository = usersRepository;
  }

  async create(email: string) {
    let user = await this._usersRepository.findByEmail(email);

    if (!user) {
      user = await this._usersRepository.create(email);
    }

    return user;
  }
}
