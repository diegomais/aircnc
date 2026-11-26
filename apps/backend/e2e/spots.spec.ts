import { expect, test } from './fixtures';

test('creates a spot, lists it by technology, and accepts a booking request', async ({
  request,
  backend,
}) => {
  const owner = await backend.createUser();
  const guest = await backend.createUser();
  const spot = await backend.createSpot(owner._id);

  expect(spot.company).toContain('Playwright Test');
  expect(spot.price).toBe(25);

  const listResponse = await request.get('/spots', {
    params: { tech: spot.techs[0] },
  });
  expect(listResponse.status()).toBe(200);
  expect(await listResponse.json()).toEqual(
    expect.arrayContaining([expect.objectContaining({ _id: spot._id })])
  );

  const booking = await backend.createBooking(guest._id, spot._id);
  expect(booking.spot.company).toBe(spot.company);
  expect(booking.user.email).toBe(guest.email);
});

test('returns an error when booking a spot that does not exist', async ({
  request,
}) => {
  const missingSpotId = '000000000000000000000001';
  const response = await request.post(`/spots/${missingSpotId}/bookings`, {
    headers: { user_id: '000000000000000000000002' },
    data: { date: '2026-12-02' },
  });

  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ error: 'Spot does not exists.' });
});
