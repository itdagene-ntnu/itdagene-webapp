import React, { useEffect, useRef } from 'react';
import App from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as Sentry from '@sentry/node';
// import { NextUIProvider } from '@nextui-org/react';

// All css imports go here
import '../styles/tokens.css';
import '../styles/site.css';
import './global.css';
import './test.css';
import 'video-react/dist/video-react.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'rc-slider/assets/index.css';
import { focusRouteContent } from '../utils/navigationFocus';

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  dsn: process.env.SENTRY_DSN,
});

const RouteFocusManager = (): null => {
  const router = useRouter();
  const previousPathname = useRef(router.pathname);

  useEffect(() => {
    if (previousPathname.current === router.pathname) return;
    previousPathname.current = router.pathname;

    const timeout = window.setTimeout(() => {
      focusRouteContent();
    }, 0);
    return (): void => window.clearTimeout(timeout);
  }, [router.pathname]);

  return null;
};

export default class MyApp extends App {
  render(): JSX.Element {
    const { Component, pageProps } = this.props;

    // https://github.com/zeit/next.js/issues/8592
    // @ts-ignore
    const { err } = this.props;
    const modifiedPageProps = { ...pageProps, err };

    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <RouteFocusManager />
        <Component {...modifiedPageProps} />
      </>
    );
  }
}
