import { expect, test } from './fixtures';

test('rejects session creation when the email is missing', async ({
  request,
}) => {
  const response = await request.post('/sessions', { data: {} });

  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({
    error: 'User email is required.',
  });
});

test('creates and returns a user for a valid email', async ({ backend }) => {
  const user = await backend.createUser();

  expect(user._id).toEqual(expect.any(String));
  expect(user.email).toMatch(/^playwright-.+@example\.test$/);
});
