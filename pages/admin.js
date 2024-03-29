import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "../components/ErrorMessage";
import CreatePost from "../components/admin/CreatePost";

export default function Admin() {
  const { t } = useTranslation(["common", "admin"]);
  const [allowed, setAllowed] = useState(false);
  const THE_TITLE = `${t("admin", { ns: "admin" })} - ${t("app-name")}`;

  const { user } = useContext(UserContext);

  // on client side only, change state
  useEffect(() => {
    if (user?.isAdmin) setAllowed(true);
    else setAllowed(false);
  }, [user]);

  useEffect(() => {
    /* 
    scroll to the top of the page when the user changes (also needed when visiting from another page, 
    because we have scroll="false" in the Link component, to prevent scrolling to the top of the page before animation ends)
    */
    window.scrollTo(0, 0);
  }, [user?.id]);

  if (!allowed)
    return (
      <>
        <Head>
          <title>{THE_TITLE}</title>
          <meta name="description" content={t("descriptions.admin")} />
        </Head>

        <ErrorMessage error={t("error-text.not-allowed", { ns: "common" })} />
      </>
    );
  return (
    <>
      <Head>
        <title>{THE_TITLE}</title>
        <meta name="description" content="content" />
      </Head>

      <CreatePost />
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
