import React from 'react'
import { render } from '@testing-library/react'
import { SignInTemplate } from '.'

describe('<SignInTemplate />', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<SignInTemplate />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('should show a description message', () => {
    const { getByText } = render(<SignInTemplate />)
    expect(getByText(/talents/i)).toBeInTheDocument()
  })
})
