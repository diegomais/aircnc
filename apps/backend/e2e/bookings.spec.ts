import mongoose from 'mongoose';
import { expect, test } from './fixtures';

test('allows the spot owner to reject and approve a booking', async ({
  request,
  backend,
}) => {
  const owner = await backend.createUser();
  const guest = await backend.createUser();
  const spot = await backend.createSpot(owner._id);
  const booking = await backend.createBooking(guest._id, spot._id);
  const unauthorizedUserId = new mongoose.Types.ObjectId().toString();

  const unauthorizedApproval = await request.post(
    `/bookings/${booking._id}/approvals`,
    { headers: { user_id: unauthorizedUserId } }
  );
  expect(unauthorizedApproval.status()).toBe(400);
  expect(await unauthorizedApproval.json()).toEqual({
    error: 'Access denied to accept this request.',
  });

  const unauthorizedRejection = await request.post(
    `/bookings/${booking._id}/rejections`,
    { headers: { user_id: unauthorizedUserId } }
  );
  expect(unauthorizedRejection.status()).toBe(400);
  expect(await unauthorizedRejection.json()).toEqual({
    error: 'Access denied to reject this request.',
  });

  const rejection = await request.post(`/bookings/${booking._id}/rejections`, {
    headers: { user_id: owner._id },
  });
  expect(rejection.status()).toBe(200);
  expect((await rejection.json()).approved).toBe(false);

  const approval = await request.post(`/bookings/${booking._id}/approvals`, {
    headers: { user_id: owner._id },
  });
  expect(approval.status()).toBe(200);
  expect((await approval.json()).approved).toBe(true);
});

test('requires a user and an existing booking to approve or reject', async ({
  request,
}) => {
  const missingBookingId = new mongoose.Types.ObjectId().toString();
  const userId = new mongoose.Types.ObjectId().toString();

  for (const action of ['approvals', 'rejections']) {
    const missingUser = await request.post(
      `/bookings/${missingBookingId}/${action}`
    );
    expect(missingUser.status()).toBe(400);
    expect(await missingUser.json()).toEqual({
      error: 'User ID is necessary in request headers.',
    });

    const missingBooking = await request.post(
      `/bookings/${missingBookingId}/${action}`,
      { headers: { user_id: userId } }
    );
    expect(missingBooking.status()).toBe(400);
    expect(await missingBooking.json()).toEqual({
      error: 'Reservation request does not exists.',
    });
  }
});
