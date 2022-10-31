import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html dir="rtl">
      <Head>
        {/* adding font, see: https://nextjs.org/docs/basic-features/font-optimization */}
        {/* I'm using "&display=swap" because I want it to swap the font after it was loaded,
            see: https://nextjs.org/docs/messages/google-font-display
            if I won't do it, the font will not be shown on initial load....  */}
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik+Dirt&display=swap"
          rel="stylesheet"
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
