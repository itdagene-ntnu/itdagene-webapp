//@flow
import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui-css/themes/default/assets/fonts/icons.eot';
import 'semantic-ui-css/themes/default/assets/fonts/icons.woff';
import 'semantic-ui-css/themes/default/assets/fonts/icons.woff2';

import Document, { Head, Main, NextScript } from 'next/document';
import Raven from 'raven';
import { ServerStyleSheet } from 'styled-components';
import * as React from 'react';

export default class Default extends Document {
  static getInitialProps({ renderPage, err }: Object) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    );
    if (page.err) {
      Raven.captureException(page.err);
    }
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    return (
      <html>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic&subset=latin"
            rel="stylesheet"
          />
          <style>{`
            body {
              margin: 0;
              padding: 0;
              font-size: 16px;
              line-height: 1.4285em;
              color: rgba(0, 0, 0, 0.87);
              font-smoothing: antialiased;
              word-break: break-word;
            }
            a {
              color: #037bb4;
              text-decoration: none;
            }

            a:hover {
              color: #1e70bf;
              text-decoration: none;
            }


          `}</style>
          {/*<link rel="stylesheet" href="/_next/static/style.css" key="css" />*/}

          {this.props.styleTags}
        </Head>
        <body style={{ fontFamily: "'Lato', sans-serif" }}>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
