//@flow
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
          <title>itDAGENE</title>
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
              color: rgba(0, 0, 0, 0.87);
              font-smoothing: antialiased;
              word-break: break-word;
            }
            p {
              line-height: 1.4285em;
            }
            a {
              color: #037bb4;
              text-decoration: none;
            }

            a:hover {
              color: #1e70bf;
              text-decoration: none;
            }
            h1 {
              font-weight: normal;
            }


          `}</style>

          <meta name="theme-color" content="#0d7ab3" />
          <link
            rel="icon"
            type="image/png"
            href="/static/icon-512x512.png"
            sizes="512x512"
          />
          <link
            rel="apple-touch-icon"
            href="/static/icon-512x512.png"
            sizes="512x512"
          />
          <link
            rel="icon"
            type="image/png"
            href="/static/icon-384x384.png"
            sizes="384x384"
          />
          <link
            rel="apple-touch-icon"
            href="/static/icon-384x384.png"
            sizes="384x384"
          />
          <link
            rel="icon"
            type="image/png"
            href="/static/icon-256x256.png"
            sizes="256x256"
          />
          <link
            rel="apple-touch-icon"
            href="/static/icon-256x256.png"
            sizes="256x256"
          />
          <link
            rel="icon"
            type="image/png"
            href="/static/icon-192x192.png"
            sizes="192x192"
          />
          <link
            rel="apple-touch-icon"
            href="/static/icon-192x192.png"
            sizes="192x192"
          />
          <link
            rel="icon"
            type="image/png"
            href="/static/icon-96x96.png"
            sizes="96x96"
          />
          <link
            rel="apple-touch-icon"
            href="/static/icon-96x96.png"
            sizes="96x96"
          />
          <link
            rel="icon"
            type="image/png"
            href="/static/icon-48x48.png"
            sizes="48x48"
          />
          <link
            rel="apple-touch-icon"
            href="/static/icon-48x48.png"
            sizes="48x48"
          />

          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="itDAGENE" />
          <link rel="manifest" href="/static/manifest.json" />

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
