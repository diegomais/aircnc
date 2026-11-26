import { expect, test } from './fixtures';

test('serves a spot thumbnail and returns 404 for a missing file', async ({
  request,
  backend,
}) => {
  const owner = await backend.createUser();
  const spot = await backend.createSpot(owner._id);
  const thumbnailPath = new URL(spot.thumbnail_url).pathname;
  const fileResponse = await request.get(thumbnailPath);

  expect(fileResponse.status()).toBe(200);
  expect(fileResponse.headers()['content-type']).toContain('image/png');

  const missingFileResponse = await request.get(
    '/files/playwright-missing-file.png'
  );
  expect(missingFileResponse.status()).toBe(404);
});
