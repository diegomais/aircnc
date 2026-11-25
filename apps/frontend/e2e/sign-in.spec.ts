import { randomUUID } from 'node:crypto'
import { expect, test } from './fixtures'

test('signs in and opens the dashboard', async ({ backend, page }) => {
  const email = `playwright-login-${randomUUID()}@example.test`
  backend.trackEmail(email)

  await page.goto('/')

  await expect(page).toHaveTitle(/aircnc \| Login/)
  await expect(page.getByLabel('E-mail')).toBeVisible()
  await page.getByLabel('E-mail').fill(email)
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page).toHaveTitle(/aircnc \| Dashboard/)
  await expect(page.getByRole('button', { name: 'Add new spot' })).toBeVisible()
  await expect(page).toHaveURL(/\/dashboard$/)
  expect(
    await page.evaluate(() => localStorage.getItem('aircnc:user'))
  ).toBeTruthy()
})

test('blocks an invalid email before sending the sign-in request', async ({
  page,
}) => {
  let sessionRequestSent = false
  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/sessions') {
      sessionRequestSent = true
    }
  })

  await page.goto('/')
  await page.getByLabel('E-mail').fill('not-an-email')
  await page.getByRole('button', { name: 'Sign in' }).click()

  expect(
    await page
      .getByLabel('E-mail')
      .evaluate((input: HTMLInputElement) => input.validity.typeMismatch)
  ).toBe(true)
  await expect(page).toHaveURL(/\/$/)
  expect(sessionRequestSent).toBe(false)
})
