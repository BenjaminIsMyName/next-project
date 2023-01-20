import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useRef } from "react";
import { useEffect } from "react";
import Feed from "../../components/Feed";

export default function TopicPage() {
  const router = useRouter();
  const { t } = useTranslation(["common"]);

  return (
    <>
      <Head>
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

export async function getServerSideProps(ctx) {
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
