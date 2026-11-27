export class SpotsService {
  private readonly _spotsRepository: {
    findByUserId(userId: string): Promise<any>;
  };

  constructor({
    spotsRepository,
  }: {
    spotsRepository: SpotsService['_spotsRepository'];
  }) {
    this._spotsRepository = spotsRepository;
  }

  async listByUserId(userId: string) {
    return this._spotsRepository.findByUserId(userId);
  }
}
