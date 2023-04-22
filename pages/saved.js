import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import SavedPosts from "../components/SavedPosts";
import SavedIcon from "../components/icons/SavedIcon";
import useLoaded from "../hooks/useLoaded";

export default function Saved() {
  const { t } = useTranslation(["common", "menu"]);
  const THE_TITLE = `${t("saved", { ns: "menu" })} - ${t("app-name")}`;
  const { user } = useContext(UserContext);
  const loaded = useLoaded();

  useEffect(() => {
    /* 
    scroll to the top of the page when the user changes (also needed when visiting from another page, 
    because we have scroll="false" in the Link component, to prevent scrolling to the top of the page before animation ends)
    */
    window.scrollTo(0, 0);
  }, [user?.id]);

  return (
    <>
      <Head>
        <title>{THE_TITLE}</title>
        <meta name="description" content={t("descriptions.saved")} />
      </Head>
      <div className="feed">
        {loaded && user ? (
          <SavedPosts />
        ) : (
          <>
            <div className="m-auto w-1/6 flex fill-error-color mt-[min(144px,20vh)] justify-center animate-bounce">
              <SavedIcon />
            </div>
            <span className="block bg-error-color text-center my-9 mx-10 text-main-color font-bold text-xl">
              {t("error-text.log-in-to-see-saved-posts", {
                ns: "common",
              }).toUpperCase()}
            </span>
          </>
        )}
      </div>
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
