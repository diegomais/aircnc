import { randomUUID } from 'node:crypto';
import { unlink } from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';
import { test as base, expect, type APIRequestContext } from '@playwright/test';

const mongoUri =
  process.env.E2E_MONGODB_URI ?? 'mongodb://127.0.0.1:27017/aircnc';

type TestUser = { _id: string; email: string };
type TestSpot = {
  _id: string;
  company: string;
  techs: string[];
  price: number;
  thumbnail: string;
  thumbnail_url: string;
};
type TestBooking = {
  _id: string;
  date: string;
  spot: { company: string };
  user: { email: string };
};

type BackendFixture = {
  createUser: () => Promise<TestUser>;
  createSpot: (userId: string) => Promise<TestSpot>;
  createBooking: (userId: string, spotId: string) => Promise<TestBooking>;
};

type TestFixtures = { backend: BackendFixture };

function assertLocalUrl(value: string, variableName: string): void {
  const hostname = new URL(value).hostname;

  if (!['localhost', '127.0.0.1', '[::1]', '::1'].includes(hostname)) {
    throw new Error(`${variableName} must point to localhost for these tests.`);
  }
}

async function createUser(request: APIRequestContext): Promise<TestUser> {
  const email = `playwright-${randomUUID()}@example.test`;
  const response = await request.post('/sessions', { data: { email } });
  const body = await response.json();

  expect(response.status(), JSON.stringify(body)).toBe(200);
  expect(body.email).toBe(email);
  return body as TestUser;
}

async function createSpot(
  request: APIRequestContext,
  userId: string
): Promise<TestSpot> {
  const runId = randomUUID();
  const company = `Playwright Test ${runId}`;
  const response = await request.post('/spots', {
    headers: { user_id: userId },
    multipart: {
      company,
      techs: `Playwright-${runId}`,
      price: '25',
      thumbnail: {
        name: 'spot.png',
        mimeType: 'image/png',
        buffer: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/a3cAAAAASUVORK5CYII=',
          'base64'
        ),
      },
    },
  });
  const body = await response.json();

  expect(response.status(), JSON.stringify(body)).toBe(200);
  expect(body.company).toBe(company);
  return body as TestSpot;
}

async function createBooking(
  request: APIRequestContext,
  userId: string,
  spotId: string
): Promise<TestBooking> {
  const date = '2026-12-01';
  const response = await request.post(`/spots/${spotId}/bookings`, {
    headers: { user_id: userId },
    data: { date },
  });
  const body = await response.json();

  expect(response.status(), JSON.stringify(body)).toBe(200);
  expect(body.date).toBe(date);
  return body as TestBooking;
}

export const test = base.extend<TestFixtures>({
  backend: async ({ request }, use) => {
    const apiUrl = process.env.API_BASE_URL ?? 'http://127.0.0.1:3333';
    assertLocalUrl(apiUrl, 'API_BASE_URL');
    assertLocalUrl(mongoUri, 'E2E_MONGODB_URI');

    const createdEmails: string[] = [];
    const createdSpotIds: string[] = [];
    const createdBookingIds: string[] = [];
    const createdThumbnails: string[] = [];

    const fixture: BackendFixture = {
      createUser: async () => {
        const user = await createUser(request);
        createdEmails.push(user.email);
        return user;
      },
      createSpot: async (userId) => {
        const spot = await createSpot(request, userId);
        createdSpotIds.push(spot._id);
        createdThumbnails.push(spot.thumbnail);
        return spot;
      },
      createBooking: async (userId, spotId) => {
        const booking = await createBooking(request, userId, spotId);
        createdBookingIds.push(booking._id);
        return booking;
      },
    };

    try {
      await use(fixture);
    } finally {
      if (
        createdEmails.length ||
        createdSpotIds.length ||
        createdBookingIds.length
      ) {
        await mongoose.connect(mongoUri);
        const objectIds = (ids: string[]) =>
          ids.map((id) => new mongoose.Types.ObjectId(id));
        const database = mongoose.connection.db;

        await database.collection('bookings').deleteMany({
          _id: { $in: objectIds(createdBookingIds) },
        });
        await database.collection('spots').deleteMany({
          _id: { $in: objectIds(createdSpotIds) },
        });
        await database.collection('users').deleteMany({
          email: { $in: createdEmails },
        });
        await mongoose.disconnect();
      }

      await Promise.all(
        createdThumbnails.map((filename) =>
          unlink(path.resolve(process.cwd(), 'uploads', filename)).catch(
            (error: NodeJS.ErrnoException) => {
              if (error.code !== 'ENOENT') throw error;
            }
          )
        )
      );
    }
  },
});

export { expect };
