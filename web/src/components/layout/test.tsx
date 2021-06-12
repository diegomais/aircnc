import React from 'react'
import { render } from '@testing-library/react'
import { Layout } from '.'

describe('<LayoutComponent />', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Layout>{}</Layout>)
    expect(asFragment()).toMatchSnapshot()
  })

  it('should show a logo image', () => {
    const { getByAltText } = render(<Layout>{}</Layout>)
    expect(getByAltText(/aircnc/i)).toBeInTheDocument()
  })

  it('should render children element', () => {
    const { getByText } = render(
      <Layout>
        <p>some text</p>
      </Layout>
    )
    expect(getByText(/some text/i)).toBeInTheDocument()
  })
})
