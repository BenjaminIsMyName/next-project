import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import ErrorText from "../components/ErrorText";

export default function Custom500() {
  const { t } = useTranslation(["common"]);
  return (
    <>
      <Head>
        <title>{t("server-side-error")}</title>
      </Head>

      <ErrorText code="500" text={t("server-side-error")} />
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
