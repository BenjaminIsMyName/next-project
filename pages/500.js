import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Custom500() {
  return <h1>500 - Server-side error occurred</h1>;
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps(ctx) {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale, [
        "menu",
        "common",
        "admin",
      ])),
    },
  };
}
