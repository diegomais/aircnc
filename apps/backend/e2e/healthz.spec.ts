import { expect, test } from '@playwright/test';

test('reports healthy when the API and MongoDB are ready', async ({
  request,
}) => {
  const response = await request.get('/healthz');

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');
  expect(await response.json()).toEqual({ status: 'ok' });
});
