import Head from 'next/head'
import { DashboardTemplate } from '../templates/dashboard'

export default function DashboardPage(): JSX.Element {
  return (
    <>
      <Head>
        <title>aircnc | Dashboard </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardTemplate />
    </>
  )
}
