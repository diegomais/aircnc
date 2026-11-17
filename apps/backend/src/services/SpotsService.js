export class SpotsService {
  constructor({ spotsRepository }) {
    this._spotsRepository = spotsRepository;
  }

  async listByUserId(userId) {
    return await this._spotsRepository.findByUserId(userId);
  }
}
