import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html dir='rtl'>
      <Head />
      <body dir='rtl'>
        <Main />
        <NextScript />
        {/* <Script src='https://accounts.google.com/gsi/client' async defer /> */}
        {/* <Script
          src='https://accounts.google.com/gsi/client'
          strategy='beforeInteractive'
        /> */}
        {/* TODO: due to a bug, the above doesn't work. Try updating Next.js in the future. More info: https://github.com/vercel/next.js/discussions/35064 */}
        <script
          src='https://accounts.google.com/gsi/client'
          async
          defer
        ></script>
      </body>
    </Html>
  );
}
