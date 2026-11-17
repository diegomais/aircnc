import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { SessionService } from '../../src/services/SessionService.js';

// Mock usersRepository
function createUsersRepositoryMock({ findByEmailResult = null, createResult = null, throwOn = null } = {}) {
  return {
    findByEmail: async (email) => {
      if (throwOn === 'findByEmail') throw new Error('findByEmail error');
      return findByEmailResult;
    },
    create: async (email) => {
      if (throwOn === 'create') throw new Error('create error');
      return createResult || { email };
    },
  };
}

describe('SessionService', () => {
  test('should return existing user if found', async () => {
    const mockUser = { email: 'test@example.com', _id: '1' };
    const usersRepository = createUsersRepositoryMock({ findByEmailResult: mockUser });
    const service = new SessionService({ usersRepository });
    const user = await service.create('test@example.com');
    assert.deepEqual(user, mockUser);
  });

  test('should create and return new user if not found', async () => {
    const newUser = { email: 'new@example.com', _id: '2' };
    const usersRepository = createUsersRepositoryMock({ findByEmailResult: null, createResult: newUser });
    const service = new SessionService({ usersRepository });
    const user = await service.create('new@example.com');
    assert.deepEqual(user, newUser);
  });

  test('should propagate errors from usersRepository.findByEmail', async () => {
    const usersRepository = createUsersRepositoryMock({ throwOn: 'findByEmail' });
    const service = new SessionService({ usersRepository });
    await assert.rejects(() => service.create('fail@example.com'), /findByEmail error/);
  });

  test('should propagate errors from usersRepository.create', async () => {
    const usersRepository = createUsersRepositoryMock({ findByEmailResult: null, throwOn: 'create' });
    const service = new SessionService({ usersRepository });
    await assert.rejects(() => service.create('fail2@example.com'), /create error/);
  });
});
