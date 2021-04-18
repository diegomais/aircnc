import Head from 'next/head';
import { AddSpotTemplate } from '../templates/spot-add';

export default function AddSpotPage() {
  return (
    <>
      <Head>
        <title>aircnc | Add spot </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AddSpotTemplate />
    </>
  );
}
