import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import SavedPosts from "../components/SavedPosts";
import SavedIcon from "../components/icons/SavedIcon";
import useLoaded from "../hooks/useLoaded";
import connectToDatabase from "../util/mongodb";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Link from "next/link";
export default function Topics({ topics }) {
  const { t } = useTranslation(["common", "menu"]);
  const THE_TITLE = `${t("topics", { ns: "menu" })} - ${t("app-name")}`;
  const { locale } = useRouter();
  const parsedTopics = JSON.parse(topics);
  return (
    <>
      <Head>
        <title>{THE_TITLE}</title>
        <meta name="description" content={t("descriptions.topics")} />
      </Head>
      <motion.div layout className="feed flex flex-col gap-3 mt-3 md:mt-0">
        {parsedTopics.map(t => (
          <Link key={t._id} href={`/topic/${t._id}`}>
            <a
              className="block text-option-text-color bg-second-color p-3 mx-2 md:mx-0 shadow-sm shadow-shadows-color 
            hover:bg-third-color hover:bg-opacity-50 transition-[opacity,background-color]"
            >
              {locale === "en" ? t.english : t.hebrew}
            </a>
          </Link>
        ))}
      </motion.div>
    </>
  );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps(ctx) {
  // get topics from DB
  let topics = null;
  try {
    const { db } = await connectToDatabase();
    topics = await db.collection("topics").find({}).toArray();
  } catch (error) {
    return {
      redirect: {
        destination: "/500",
        statusCode: 308,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale, [
        "menu",
        "common",
        "admin",
      ])),
      topics: JSON.stringify(topics),
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 60, // In seconds
    // TODO: change to on-demand-revalidation https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#on-demand-revalidation
  };
}
