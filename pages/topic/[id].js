import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useRef } from "react";
import { useEffect } from "react";
import Feed from "../../components/Feed";
import connectToDatabase from "../../util/mongodb";

export default function TopicPage() {
  const router = useRouter();
  const { t } = useTranslation(["common"]);
  const THE_TITLE = `${t("topic")} - ${t("app-name")}`;
  return (
    <>
      <Head>
        <title>{THE_TITLE}</title>
        <meta name="description" content="content" />
        {/* adding "/" before favicon solves a bug, see: 
        https://www.reddit.com/r/nextjs/comments/pnmj9n/comment/hctyraz/?utm_source=share&utm_medium=web2x&context=3
        and: https://github.com/vercel/next.js/discussions/13301 */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Feed type="topic" topicId={router.query.id} />
    </>
  );
}

export async function getStaticPaths() {
  const { db } = await connectToDatabase();

  const topics = await db.collection("topics").find({}).toArray();

  let paths = topics.map(t => ({ params: { id: t._id.toString() } }));

  return {
    paths: paths,
    fallback: true,
  };
}

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
