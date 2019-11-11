//@flow
import Document, { Head, Main, NextScript } from 'next/document';
import Raven from 'raven';
import { ServerStyleSheet } from 'styled-components';
import * as React from 'react';
import { itdageneBlue, itdageneLightBlue } from '../utils/colors';

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
    const { GA_TRACKING_ID } = process.env;
    return (
      <html lang="nb">
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          />
          <link
            href="https://cdn.rawgit.com/h-ibaldo/Raleway_Fixed_Numerals/master/css/rawline.css"
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
              font-family: rawline;
            }
            img {
              max-width: 100%;
            }
            p {
              line-height: 1.4285em;
            }
            a {
              color: ${itdageneBlue};
              text-decoration: none;
            }

            a:hover {
              color: ${itdageneLightBlue};
              text-decoration: none;
            }
            h1,h2,h3,h4 {
              font-weight: 500;
            }

          `}</style>

          <meta name="theme-color" content="#ffffff" />
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

          <base target="_blank" />

          {this.props.styleTags}

          {GA_TRACKING_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
            window.__GA_TRACKING_ID__ = '${GA_TRACKING_ID}';
          `
                }}
              />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
