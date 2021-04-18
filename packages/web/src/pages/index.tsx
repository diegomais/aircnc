import Head from 'next/head';
import { SignInTemplate } from '../templates/sign-in';

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>aircnc | Login </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SignInTemplate />
    </>
  );
}
