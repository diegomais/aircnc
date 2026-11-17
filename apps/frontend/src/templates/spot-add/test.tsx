import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { api } from '../../services/api'
import { AddSpotTemplate } from '.'

describe('<AddSpotTemplate />', () => {
  jest.mock('../../services/api')
  const mockedApi = api as jest.Mocked<typeof api>
  const spyPost = jest.spyOn(mockedApi, 'post')

  it('matches snapshot', () => {
    const { asFragment } = render(<AddSpotTemplate />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('should be able to add a new spot', () => {
    const { getByPlaceholderText, getByText } = render(<AddSpotTemplate />)
    fireEvent.change(getByPlaceholderText(/company name/i), {
      target: { value: 'great place to work' },
    })
    fireEvent.change(getByPlaceholderText(/techs used by company/i), {
      target: { value: 'react' },
    })
    fireEvent.change(getByPlaceholderText(/price per day/i), {
      target: { value: '99' },
    })
    expect(spyPost).not.toBeCalled()
    fireEvent.click(getByText(/add new spot/i))
    expect(spyPost).toBeCalledTimes(1)
  })
})
