import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html dir="rtl">
      {/* ----- code for PWA from https://www.npmjs.com/package/next-pwa ----- */}
      <meta name="application-name" content="Redilet" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Redilet" />
      <meta name="description" content="Watch the latest news from Redilet" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#232323" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#232323" />
      <link rel="mask-icon" href="/favicon.ico" color="#232323" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:url" content="https://redilet.com" />
      <meta name="twitter:title" content="Redilet" />
      <meta
        name="twitter:description"
        content="Watch the latest news from Redilet"
      />
      <meta
        name="twitter:image"
        content="https://redilet.com/android-icon-192x192.png"
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Redilet" />
      <meta
        property="og:description"
        content="Watch the latest news from Redilet"
      />
      <meta property="og:site_name" content="Redilet" />
      <meta property="og:url" content="https://redilet.com" />
      {/* ----- code for PWA from https://www.npmjs.com/package/next-pwa ----- */}

      {/* ----- All the code & files favicon-generator.org generated ----- */}
      <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
      <link
        rel="apple-touch-icon"
        sizes="114x114"
        href="/apple-icon-114x114.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="120x120"
        href="/apple-icon-120x120.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="144x144"
        href="/apple-icon-144x144.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="/apple-icon-152x152.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-icon-180x180.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/android-icon-192x192.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/favicon-96x96.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/manifest.json" />
      <meta name="msapplication-TileColor" content="#232323" />
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      <meta name="theme-color" content="#232323"></meta>
      {/* ----- All the code & files favicon-generator.org generated ----- */}
      <Head>
        {/* adding font, see: https://nextjs.org/docs/basic-features/font-optimization */}
        {/* I'm using "&display=swap" because I want it to swap the font after it was loaded,
            see: https://nextjs.org/docs/messages/google-font-display
            if I won't do it, the font will not be shown on initial load....  */}
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik+Dirt&display=swap"
          rel="stylesheet"
        />
        {/* load script for "Sign In With Google", 
            see https://nextjs.org/docs/basic-features/script
            and see: https://developers.google.com/identity/gsi/web/guides/client-library */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </Head>
      {/* When sending the document to the client, send it with RTL.
          That way, most users (RTL users) won't see a flicker.
          TODO: try to find a way to change it on the server already, based on user's language.
          Known issue: https://github.com/vercel/next.js/discussions/37767 */}
      <body dir="rtl">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
