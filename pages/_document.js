import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html dir='rtl'>
      <Head />
      {/* When sending the documant to the client, send it with RTL.
          That way, most users (RTL users) won't see a flicker.
          TODO: try to find a way to change it on the server already, based on user's language.
          Known issue: https://github.com/vercel/next.js/discussions/37767 */}
      <body dir='rtl'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
