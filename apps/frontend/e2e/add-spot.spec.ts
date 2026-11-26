import { randomUUID } from 'node:crypto'
import { expect, test } from './fixtures'

const image = {
  name: 'spot.png',
  mimeType: 'image/png',
  buffer: Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/a3cAAAAASUVORK5CYII=',
    'base64'
  ),
}

async function fillSpotForm(
  page,
  company: string,
  techs: string,
  price: string
): Promise<void> {
  await page.getByLabel('Company').fill(company)
  await page.getByLabel('Technologies (comma separated)').fill(techs)
  await page.getByLabel('Price (blank for free)').fill(price)
  await page.locator('input[type="file"]').setInputFiles(image)
}

test('uploads an image and creates a paid spot', async ({ backend, page }) => {
  const owner = await backend.createUser()
  const company = `Playwright Paid ${randomUUID()}`
  await page.addInitScript((userId) => {
    localStorage.setItem('aircnc:user', userId)
  }, owner._id)

  await page.goto('/add')
  await expect(page).toHaveTitle(/aircnc \| Add spot/)
  await fillSpotForm(page, company, 'React, Node.js', '125')

  const createSpotResponse = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === '/spots' &&
      response.request().method() === 'POST'
  )
  await page.getByRole('button', { name: 'Add new spot' }).click()
  const response = await createSpotResponse
  const spot = await response.json()

  expect(response.status()).toBe(200)
  backend.trackSpot(spot)
  expect(response.request().headers().user_id).toBe(owner._id)
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByText(company)).toBeVisible()
  await expect(page.getByText('$125 per day')).toBeVisible()
})

test('creates a free spot when the price is left blank', async ({
  backend,
  page,
}) => {
  const owner = await backend.createUser()
  const company = `Playwright Free ${randomUUID()}`
  await page.addInitScript((userId) => {
    localStorage.setItem('aircnc:user', userId)
  }, owner._id)

  await page.goto('/add')
  await fillSpotForm(page, company, 'TypeScript', '')

  const createSpotResponse = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === '/spots' &&
      response.request().method() === 'POST'
  )
  await page.getByRole('button', { name: 'Add new spot' }).click()
  const response = await createSpotResponse
  const spot = await response.json()

  expect(response.status()).toBe(200)
  backend.trackSpot(spot)
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByText(company)).toBeVisible()
  await expect(page.getByText('Free', { exact: true })).toBeVisible()
})
