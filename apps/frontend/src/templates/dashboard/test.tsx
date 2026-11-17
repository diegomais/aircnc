import React from 'react'
import { render, screen } from '@testing-library/react'
import { api } from '../../services/api'
import { DashboardTemplate } from '.'

describe('<DashboardTemplate />', () => {
  jest.mock('socket.io-client')
  jest.mock('../../services/api')
  const mockedApi = api as jest.Mocked<typeof api>
  mockedApi.get = jest.fn().mockResolvedValue({
    data: [{ _id: 'foo', company: 'bar', thumbnail_url: 'image.png' }],
  })
  jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('some-user-id')

  it('matches snapshot', async () => {
    const { asFragment } = render(<DashboardTemplate />)
    await screen.findByText(/bar/i)
    expect(asFragment()).toMatchSnapshot()
  })

  it('should show spot list', async () => {
    render(<DashboardTemplate />)
    expect(await screen.findByText(/bar/i)).toBeInTheDocument()
  })

  it('should show a button to add a new spot', async () => {
    render(<DashboardTemplate />)
    await screen.findByText(/bar/i)
    expect(screen.getByText(/add new spot/i)).toBeInTheDocument()
  })
})
