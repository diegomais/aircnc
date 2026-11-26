import { expect, test } from '@playwright/test';

test('returns an error from the Sentry debug endpoint', async ({ request }) => {
  const response = await request.get('/debug-sentry');

  expect(response.status()).toBe(500);
});
