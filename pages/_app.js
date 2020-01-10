import React from 'react';
import App from 'next/app';

// Required by: https://github.com/zeit/next.js/issues/5291
// This file (_app.js) and test.css can be removed when the issue is resolved
import './test.css';

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return <Component {...pageProps} />;
  }
}
