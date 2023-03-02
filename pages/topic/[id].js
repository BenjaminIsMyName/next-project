import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Feed from "../../components/Feed";
import connectToDatabase from "../../util/mongodb";
import { ObjectId } from "mongodb";

// TODO: error in dev mode, props are not passed, router.query.id is undefined....
// To see this error, run `npm run dev` and refresh any topic page.

export default function TopicPage({ topic }) {
  let parsedTopic = null;
  try {
    parsedTopic = JSON.parse(topic);
  } catch (error) {
    parsedTopic = { hewbrew: "שגיאה", english: "Error" }; // for when props are not passed.. unclear why it happens...
  }
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation(["common"]);
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
  } catch (error) {
    return {
      redirect: {
        destination: "/404",
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
      topic: JSON.stringify(topic),
    },
  };
}
