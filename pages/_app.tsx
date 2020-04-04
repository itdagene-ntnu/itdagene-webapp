import React from 'react';
import App from 'next/app';

// All css imports go here
import './test.css';
import 'video-react/dist/video-react.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'rc-slider/assets/index.css';

export default class MyApp extends App {
  render(): JSX.Element {
    const { Component, pageProps } = this.props;

    return <Component {...pageProps} />;
  }
}
