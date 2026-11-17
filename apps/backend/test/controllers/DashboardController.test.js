import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { DashboardController } from '../../src/controllers/DashboardController.js';

// Helper to create mock req/res, adapted for headers
function createMockReqRes({ headers = {} } = {}) {
  const req = { headers };
  let statusCode = null;
  let jsonResponse = null;
  const res = {
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      jsonResponse = data;
      return res;
    },
    getStatus: () => statusCode,
    getJson: () => jsonResponse,
  };
  return { req, res };
}

describe('DashboardController', () => {
  describe('show', () => {
    test('should return 400 if user_id header is missing', async () => {
      // Mock spotsService that should not be called
      const spotsService = {
        listByUserId: async () => {
          throw new Error('spotsService.listByUserId should not be called');
        },
      };
      const controller = new DashboardController({ spotsService });
      const { req, res } = createMockReqRes({ headers: {} }); // No user_id

      await controller.show(req, res);

      assert.equal(res.getStatus(), 400, 'Status code should be 400');
      assert.deepEqual(res.getJson(), { error: 'User ID is required.' }, 'Response JSON should indicate missing user_id');
    });

    test('should call spotsService.listByUserId and return spots if user_id is provided', async () => {
      const mockSpots = [{ _id: 'spot1', name: 'My Spot' }];
      const userId = 'user-123';
      let calledWithUserId = null;

      const spotsService = {
        listByUserId: async (id) => {
          calledWithUserId = id;
          return mockSpots;
        },
      };
      const controller = new DashboardController({ spotsService });
      const { req, res } = createMockReqRes({ headers: { user_id: userId } });

      await controller.show(req, res);

      assert.equal(calledWithUserId, userId, 'spotsService.listByUserId should be called with the correct user_id');
      assert.deepEqual(res.getJson(), mockSpots, 'Response JSON should be the spots array');
      assert.equal(res.getStatus(), null, 'Status code should be 200 (default, not explicitly set)');
    });

    test('should return an empty array if spotsService.listByUserId returns an empty array', async () => {
      const userId = 'user-456';
      const spotsService = { listByUserId: async () => [] };
      const controller = new DashboardController({ spotsService });
      const { req, res } = createMockReqRes({ headers: { user_id: userId } });

      await controller.show(req, res);
      assert.deepEqual(res.getJson(), [], 'Response JSON should be an empty array');
    });

    test('should handle errors thrown by spotsService.listByUserId', async () => {
      const userId = 'user-789';
      const serviceError = new Error('Service unavailable');
      const spotsService = { listByUserId: async () => { throw serviceError; } };
      const controller = new DashboardController({ spotsService });
      const { req, res } = createMockReqRes({ headers: { user_id: userId } });

      await assert.rejects(async () => controller.show(req, res), serviceError, 'Should reject with the error from the service');
    });
  });
});
