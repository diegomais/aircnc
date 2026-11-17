import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { SpotsService } from '../../src/services/SpotsService.js';

// Mock spotsRepository
function createSpotsRepositoryMock({ findByUserIdResult = [], throwOn = null } = {}) {
  return {
    findByUserId: async (userId) => {
      if (throwOn === 'findByUserId') throw new Error('findByUserId error');
      return findByUserIdResult;
    },
  };
}

describe('SpotsService', () => {
  describe('listByUserId', () => {
    test('should return spots for a given user ID', async () => {
      const mockSpots = [
        { _id: 'spot1', company: 'Test Spot 1', price: 50 },
        { _id: 'spot2', company: 'Test Spot 2', price: 75 },
      ];
      const spotsRepository = createSpotsRepositoryMock({ findByUserIdResult: mockSpots });
      const service = new SpotsService({ spotsRepository });
      const userId = 'user123';

      const spots = await service.listByUserId(userId);
      assert.deepEqual(spots, mockSpots, 'Should return the list of spots from the repository');
    });

    test('should return an empty array if no spots are found for a given user ID', async () => {
      const spotsRepository = createSpotsRepositoryMock({ findByUserIdResult: [] });
      const service = new SpotsService({ spotsRepository });
      const userId = 'user456';

      const spots = await service.listByUserId(userId);
      assert.deepEqual(spots, [], 'Should return an empty array when no spots are found');
    });

    test('should propagate errors from spotsRepository.findByUserId', async () => {
      const spotsRepository = createSpotsRepositoryMock({ throwOn: 'findByUserId' });
      const service = new SpotsService({ spotsRepository });
      const userId = 'user789';
      await assert.rejects(() => service.listByUserId(userId), /findByUserId error/, 'Should reject with the error from the repository');
    });
  });
});
