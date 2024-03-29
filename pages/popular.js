import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Feed from "../components/Feed";

export default function Popular() {
  const { t } = useTranslation(["common", "menu"]);
  const THE_TITLE = `${t("popular", { ns: "menu" })} - ${t("app-name")}`;
  return (
    <>
      <Head>
        <title>{THE_TITLE}</title>
        <meta name="description" content={t("descriptions.popular")} />
      </Head>

      <Feed type="popular" />
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
