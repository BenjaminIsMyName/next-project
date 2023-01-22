import Head from "next/head";
import Image from "next/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Feed from "../components/Feed";
export default function Home() {
  const { t } = useTranslation(["common", "menu"]);
  const THE_TITLE = `${t("for-you", { ns: "menu" })} - ${t("app-name")}`;
  return (
    <>
      <Head>
        {/* to verify ourself on https://search.google.com/ to submit the website to Google Search,
        This website cannot be found on Google rn...  */}
        <meta
          name="google-site-verification"
          content="yZqF3golrXQVvKjCLCWkbHMyVkO_hdv1S9_iBA4jYdI"
        />
        <title>{THE_TITLE}</title>
        <meta name="description" content={t("descriptions.index")} />
      </Head>

      <Feed type="for-you" />
    </>
  );
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
