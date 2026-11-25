import { randomUUID } from 'node:crypto'
import { unlink } from 'node:fs/promises'
import path from 'node:path'
import { MongoClient, ObjectId } from 'mongodb'
import {
  test as base,
  expect,
  type APIRequestContext,
  type Page,
} from '@playwright/test'

const apiBaseURL = process.env.API_BASE_URL ?? 'http://127.0.0.1:3333'
const mongoUri =
  process.env.E2E_MONGODB_URI ?? 'mongodb://127.0.0.1:27017/aircnc'
const uploadsDirectory = path.resolve(process.cwd(), '../backend/uploads')

type TestUser = { _id: string; email: string }
type TestSpot = {
  _id: string
  company: string
  techs: string[]
  price: number | null
  thumbnail: string
  thumbnail_url: string
}
type TestBooking = {
  _id: string
  date: string
  spot: { company: string }
  user: { email: string }
}

type BackendFixture = {
  trackEmail: (email: string) => void
  trackSpot: (spot: TestSpot) => void
  createUser: () => Promise<TestUser>
  createSpot: (userId: string, price?: number | null) => Promise<TestSpot>
  createBooking: (
    userId: string,
    spotId: string,
    date?: string
  ) => Promise<TestBooking>
}

type TestFixtures = {
  api: APIRequestContext
  backend: BackendFixture
}

function assertLocalUrl(value: string, variableName: string): void {
  const hostname = new URL(value).hostname

  if (!['localhost', '127.0.0.1', '[::1]', '::1'].includes(hostname)) {
    throw new Error(`${variableName} must point to localhost for these tests.`)
  }
}

export async function waitForDashboardSocket(
  page: Page,
  userId: string
): Promise<void> {
  await page.waitForResponse(
    (response) => {
      const url = new URL(response.url())
      const request = response.request()

      return (
        url.pathname.includes('/socket.io/') &&
        url.searchParams.get('user_id') === userId &&
        url.searchParams.get('transport') === 'polling' &&
        request.method() === 'POST' &&
        request.postData()?.startsWith('40') === true
      )
    },
    { timeout: 15_000 }
  )
}

export const test = base.extend<TestFixtures>({
  api: async ({ playwright }, use) => {
    assertLocalUrl(apiBaseURL, 'API_BASE_URL')
    const context = await playwright.request.newContext({
      baseURL: apiBaseURL,
      extraHTTPHeaders: { Accept: 'application/json' },
    })

    await use(context)
    await context.dispose()
  },

  backend: async ({ api }, use) => {
    assertLocalUrl(mongoUri, 'E2E_MONGODB_URI')

    const createdEmails: string[] = []
    const createdSpotIds: string[] = []
    const createdBookingIds: string[] = []
    const createdThumbnails: string[] = []

    const fixture: BackendFixture = {
      trackEmail: (email) => createdEmails.push(email),
      trackSpot: (spot) => {
        createdSpotIds.push(spot._id)
        createdThumbnails.push(spot.thumbnail)
      },
      createUser: async () => {
        const email = `playwright-${randomUUID()}@example.test`
        const response = await api.post('/sessions', { data: { email } })
        const user = await response.json()
        expect(response.status(), JSON.stringify(user)).toBe(200)
        createdEmails.push(email)
        return user as TestUser
      },
      createSpot: async (userId, price = 25) => {
        const runId = randomUUID()
        const company = `Playwright Test ${runId}`
        const response = await api.post('/spots', {
          headers: { user_id: userId },
          multipart: {
            company,
            techs: `Playwright-${runId}`,
            price: price === null ? '' : String(price),
            thumbnail: {
              name: `spot-${runId}.png`,
              mimeType: 'image/png',
              buffer: Buffer.from(
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/a3cAAAAASUVORK5CYII=',
                'base64'
              ),
            },
          },
        })
        const spot = await response.json()
        expect(response.status(), JSON.stringify(spot)).toBe(200)
        createdSpotIds.push(spot._id)
        createdThumbnails.push(spot.thumbnail)
        return spot as TestSpot
      },
      createBooking: async (userId, spotId, date = '2026-12-01') => {
        const response = await api.post(`/spots/${spotId}/bookings`, {
          headers: { user_id: userId },
          data: { date },
        })
        const booking = await response.json()
        expect(response.status(), JSON.stringify(booking)).toBe(200)
        createdBookingIds.push(booking._id)
        return booking as TestBooking
      },
    }

    try {
      await use(fixture)
    } finally {
      if (
        createdEmails.length ||
        createdSpotIds.length ||
        createdBookingIds.length
      ) {
        const client = new MongoClient(mongoUri)
        try {
          await client.connect()
          const objectIds = (ids: string[]) => ids.map((id) => new ObjectId(id))
          const database = client.db()

          await database.collection('bookings').deleteMany({
            _id: { $in: objectIds(createdBookingIds) },
          })
          await database.collection('spots').deleteMany({
            _id: { $in: objectIds(createdSpotIds) },
          })
          await database.collection('users').deleteMany({
            email: { $in: createdEmails },
          })
        } finally {
          await client.close()
        }
      }

      await Promise.all(
        createdThumbnails.map((filename) =>
          unlink(path.join(uploadsDirectory, filename)).catch(
            (error: NodeJS.ErrnoException) => {
              if (error.code !== 'ENOENT') throw error
            }
          )
        )
      )
    }
  },
})

export { expect }
