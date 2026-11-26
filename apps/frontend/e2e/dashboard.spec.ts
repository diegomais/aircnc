import { expect, test, waitForDashboardSocket } from './fixtures'

test('shows the signed-in user’s spots and links to spot creation', async ({
  backend,
  page,
}) => {
  const owner = await backend.createUser()
  const paidSpot = await backend.createSpot(owner._id, 99)
  const freeSpot = await backend.createSpot(owner._id, null)

  await page.addInitScript((userId) => {
    localStorage.setItem('aircnc:user', userId)
  }, owner._id)
  const socketConnected = waitForDashboardSocket(page, owner._id)
  await page.goto('/dashboard')
  await socketConnected

  await expect(page).toHaveTitle(/aircnc \| Dashboard/)
  await expect(page.getByText(paidSpot.company)).toBeVisible()
  await expect(page.getByText('$99 per day')).toBeVisible()
  await expect(page.getByText(freeSpot.company)).toBeVisible()
  await expect(page.getByText('Free', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Add new spot' }).click()
  await expect(page).toHaveURL(/\/add$/)
  await expect(page).toHaveTitle(/aircnc \| Add spot/)
})

test('lets the spot owner accept and reject live booking requests', async ({
  backend,
  page,
}) => {
  const owner = await backend.createUser()
  const acceptingGuest = await backend.createUser()
  const rejectingGuest = await backend.createUser()
  const spot = await backend.createSpot(owner._id)

  await page.addInitScript((userId) => {
    localStorage.setItem('aircnc:user', userId)
  }, owner._id)
  const socketConnected = waitForDashboardSocket(page, owner._id)
  await page.goto('/dashboard')
  await socketConnected

  const acceptedBooking = await backend.createBooking(
    acceptingGuest._id,
    spot._id,
    '2026-12-01'
  )
  const acceptance = page
    .getByRole('listitem')
    .filter({ hasText: acceptingGuest.email })
  await expect(acceptance).toContainText(spot.company)
  await acceptance.getByRole('button', { name: 'Accept' }).click()
  await expect(acceptance).toHaveCount(0)

  const rejectedBooking = await backend.createBooking(
    rejectingGuest._id,
    spot._id,
    '2026-12-02'
  )
  const rejection = page
    .getByRole('listitem')
    .filter({ hasText: rejectingGuest.email })
  await expect(rejection).toContainText(spot.company)
  await rejection.getByRole('button', { name: 'Reject' }).click()
  await expect(rejection).toHaveCount(0)

  expect(acceptedBooking._id).not.toBe(rejectedBooking._id)
})
