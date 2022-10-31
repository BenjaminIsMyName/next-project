import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import connectToDatabase from "../../util/mongodb";
import { ObjectId } from "mongodb";
import Post from "../../components/Post";
import { useTranslation } from "next-i18next";
export default function PostPage({ post }) {
  const postToDisplay = JSON.parse(post);
  const { t } = useTranslation(["common"]);
  const THE_TITLE = `${postToDisplay.title} - ${t("app-name")}`;
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

      <Post post={postToDisplay} />
    </>
  );
}

export async function getServerSideProps(ctx) {
  try {
    var { db } = await connectToDatabase();
    var post = await db
      .collection("posts")
      .find({ _id: new ObjectId(ctx.params.id) })
      .toArray();
    if (post.length === 0)
      throw new Error("Couldn't find a post with this _id");
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
      ...(await serverSideTranslations(ctx.locale, ["menu", "common"])),
      post: JSON.stringify(post[0]),
    },
  };
}
