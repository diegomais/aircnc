export class SpotService {
  constructor({ spotRepository }) {
    this._spotRepository = spotRepository;
  }

  async listByUserId(userId) {
    return await this._spotRepository.findByUserId(userId);
  }
} 