import { Metadata, Viewport } from "next"
import Script from "next/script"
import * as Sentry from '@sentry/node';

// All css imports go here
import './global.css'
import 'video-react/dist/video-react.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'rc-slider/assets/index.css';

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  dsn: process.env.SENTRY_DSN,
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
}

export const metadata: Metadata = {
   icons: {
     icon: [
       { url: "/static/icon-512x512.png", type: "image/png", sizes: "512x512" },
       { url: "/static/icon-384x384.png", type: "image/png", sizes: "384x384" },
       { url: "/static/icon-256x256.png", type: "image/png", sizes: "256x256" },
       { url: "/static/icon-192x192.png", type: "image/png", sizes: "192x192" },
       { url: "/static/icon-96x96.png", type: "image/png", sizes: "96x96" },
       { url: "/static/icon-48x48.png", type: "image/png", sizes: "48x48" }
     ],
     apple: [
       { url: "/static/icon-512x512.png", sizes: "512x512" },
       { url: "/static/icon-384x384.png", sizes: "384x384" },
       { url: "/static/icon-256x256.png", sizes: "256x256" },
       { url: "/static/icon-192x192.png", sizes: "192x192" },
       { url: "/static/icon-96x96.png", sizes: "96x96" },
       { url: "/static/icon-48x48.png", sizes: "48x48" }
     ]
   },
   appleWebApp: {
     title: "itDAGENE"
   },
   manifest: "/static/manifest.json"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="nb">
      {/* <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
          rel="stylesheet"
        />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.15.1/css/all.css"
          integrity="sha384-vp86vTRFVJgpjF9jiIGPEEqYqlDwgyBgEF109VFjmqGmIY/Y4HV4d3Gp2irVfcrp"
          crossOrigin="anonymous"
        />

        {this.props.styleTags}
      </Head> */}
      
      <body>
        {children}
        <Script
          type="module"
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
          strategy="beforeInteractive"
        />
        <Script
          noModule
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}