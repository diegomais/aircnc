import { expect, test } from './fixtures';

test('requires a user ID to read the dashboard', async ({ request }) => {
  const response = await request.get('/dashboard');

  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ error: 'User ID is required.' });
});

test('returns spots owned by the requested user', async ({
  request,
  backend,
}) => {
  const owner = await backend.createUser();
  const spot = await backend.createSpot(owner._id);
  const response = await request.get('/dashboard', {
    headers: { user_id: owner._id },
  });

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual(
    expect.arrayContaining([expect.objectContaining({ _id: spot._id })])
  );
});
