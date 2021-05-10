import { AppProps } from 'next/dist/next-server/lib/router/router';
import { Layout } from '../lib/Layout';
import '../styles/globals.css';
import '../styles/atom-one-dark.css';
import Head from 'next/head';
import { OverlayProvider } from '@react-aria/overlays';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>State Machines</title>
        <meta
          name="description"
          content="A collection of state machines"
        ></meta>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta property="og:type" content="article" />
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
            ></script>
            <script>
              {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
            `}
            </script>
          </>
        )}
      </Head>
      <OverlayProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </OverlayProvider>
      <script src="/highlight.pack.js"></script>
    </>
  );
}

export default MyApp;
