import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { SessionController } from '../../src/controllers/SessionController.js';

// Helper to create mock req/res
function createMockReqRes({ body = {} } = {}) {
  const req = { body };
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

describe('SessionController', () => {
  test('should return 400 if email is missing', async () => {
    const sessionService = { create: async () => { throw new Error('Should not be called'); } };
    const controller = new SessionController({ sessionService });
    const { req, res } = createMockReqRes({ body: {} });
    await controller.create(req, res);
    assert.equal(res.getStatus(), 400);
    assert.deepEqual(res.getJson(), { error: 'User email is required.' });
  });

  test('should call sessionService.create and return user if email is provided', async () => {
    const user = { email: 'test@example.com', _id: '1' };
    let calledWith = null;
    const sessionService = {
      create: async (email) => {
        calledWith = email;
        return user;
      },
    };
    const controller = new SessionController({ sessionService });
    const { req, res } = createMockReqRes({ body: { email: 'test@example.com' } });
    await controller.create(req, res);
    assert.equal(calledWith, 'test@example.com');
    assert.deepEqual(res.getJson(), user);
    assert.equal(res.getStatus(), null); // Should not set status for 200
  });

  test('should handle errors thrown by sessionService.create', async () => {
    const sessionService = {
      create: async () => { throw new Error('service error'); },
    };
    const controller = new SessionController({ sessionService });
    const { req, res } = createMockReqRes({ body: { email: 'fail@example.com' } });
    let errorCaught = null;
    try {
      await controller.create(req, res);
    } catch (err) {
      errorCaught = err;
    }
    assert(errorCaught instanceof Error);
    assert.equal(errorCaught.message, 'service error');
  });
}); 