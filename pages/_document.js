//@flow
import * as React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import flush from 'styled-jsx/server';
import Footer from '../components/Footer';

import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui-css/themes/default/assets/fonts/icons.eot';
import 'semantic-ui-css/themes/default/assets/fonts/icons.woff';
import 'semantic-ui-css/themes/default/assets/fonts/icons.woff2';

export default class Default extends Document {
  static getInitialProps({ renderPage }: Object) {
    const { html, head, errorHtml, chunks } = renderPage();
    const styles = flush();
    return { html, head, errorHtml, chunks, styles };
  }

  render() {
    return (
      <html>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          />
          <style>{`body { margin: 0 } /* custom! */
    .hidden.menu {
      display: none;
    }
    .segment {
      padding: 1em 0em;
    }
     .logo.item img {
      margin-right: 1em;
    }
     .ui.menu .ui.button {
      margin-left: 0.5em;
    }
     h1.ui.header {
      margin-top:1.5em;
      margin-bottom: 0em;
      font-size: 4em!important;
      font-weight: normal;
    }
     h2 {
      font-size: 1.7em;
      font-weight: normal;
    }
    .ui.vertical.stripe {
      padding: 8em 0em;
    }
    .ui.vertical.stripe h3 {
      font-size: 2em;
    }
    .ui.vertical.stripe .button + h3,
    .ui.vertical.stripe p + h3 {
      margin-top: 1.5em;
    }
    .ui.vertical.stripe .floated.image {
      clear: both;
    }
    .ui.vertical.stripe p {
      font-size: 1.33em;
    }
    .ui.vertical.stripe .horizontal.divider {
      margin: 3em 0em;
    }
    .quote.stripe.segment {
      padding: 0em;
    }
    .quote.stripe.segment .grid .column {
      padding-top: 5em;
      padding-bottom: 5em;
    }
    .footer.segment {
      padding: 5em 0em;
    }
    .secondary.pointing.menu .toc.item {
      display: none;
    }
    @media only screen and (max-width: 700px) {
      .ui.fixed.menu {
        display: none !important;
      }
      .secondary.pointing.menu .item,
      .secondary.pointing.menu .menu {
        display: none;
      }
      .secondary.pointing.menu .toc.item {
        display: block;
      }
      .segment {
        min-height: 350px;
      }
       h1.ui.header {
        font-size: 2em !important;
        margin-top: 1.5em;
      }
       h2 {
        margin-top: 0.5em;
        font-size: 1.5em;
      }
    }
    body {
      display: flex;
      min-height: 100vh;
      flex-direction: column;
    }

    .main {
      flex: 1;
    }

          `}</style>
          <link rel="stylesheet" href="/_next/static/style.css" key="css" />
        </Head>
        <body>
          <main className="main">
            <Main />
            <NextScript />
          </main>
          <Footer />
        </body>
      </html>
    );
  }
}
