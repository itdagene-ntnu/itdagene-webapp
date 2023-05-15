import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import * as Sentry from '@sentry/node';
// import { NextUIProvider } from '@nextui-org/react';

// All css imports go here
import './test.css';
import 'video-react/dist/video-react.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'rc-slider/assets/index.css';

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  dsn: process.env.SENTRY_DSN,
});

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
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          />
        </Head>

        <Component {...modifiedPageProps} />
      </>
    );
  }
}
