import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Feed from "../../components/Feed";
import connectToDatabase from "../../util/mongodb";
import { ObjectId } from "mongodb";
import Loading from "../../components/Loading";

export default function TopicPage({ topic }) {
  const router = useRouter();
  const { t } = useTranslation(["common"]);

  if (router.isFallback) {
    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    return <Loading />;
  }

  let parsedTopic = JSON.parse(topic);

  const { locale } = router;

  const THE_TITLE = `${t("topic")} - ${
    locale === "en" ? parsedTopic.english : parsedTopic.hebrew
  } - ${t("app-name")}`;
  return (
    <>
      <Head>
        <title>{THE_TITLE}</title>
        <meta
          name="description"
          content={t("descriptions.topic", {
            topicTitle:
              locale === "en" ? parsedTopic.english : parsedTopic.hebrew,
          })}
        />
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
  const { params } = ctx;
  const id = params.id;

  try {
    var { db } = await connectToDatabase();
    var topic = await db.collection("topics").findOne({ _id: ObjectId(id) });
    if (!topic) {
      // null if not found
      return {
        notFound: true, // see: https://nextjs.org/docs/api-reference/data-fetching/get-static-props#notfound
      };
    }
  } catch (error) {
    // will reach here if id is not valid ObjectId
    return {
      notFound: true, // see: https://nextjs.org/docs/api-reference/data-fetching/get-static-props#notfound
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale, [
        "menu",
        "common",
        "admin",
      ])),
      topic: JSON.stringify(topic),
    },
    revalidate: 60, // In seconds, why - to show up-to-date name of topic (if got edited)
    // TODO: change to on-demand-revalidation https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#on-demand-revalidation
  };
}
