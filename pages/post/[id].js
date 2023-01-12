import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import connectToDatabase from "../../util/mongodb";
import { ObjectId } from "mongodb";
import Post from "../../components/Post";
import { useTranslation } from "next-i18next";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useRef } from "react";
import { useEffect } from "react";

export default function PostPage({ post }) {
  const postToDisplay = JSON.parse(post);
  const { t } = useTranslation(["common"]);
  const THE_TITLE = `${postToDisplay.title} - ${t("app-name")}`;

  /*
    How to update the UI when user logs in/out? We want to call the function getServerSideProps again...
    We need to re-check if the post was liked by the new user etc...
    So, as a half-solution, I refresh the page when the user changes.
    See commit: 70f07f788d8096ff14d7a12fc238917996c8ddfa
  */
  const { user } = useContext(UserContext);
  const renderCount = useRef(0);
  useEffect(() => {
    // don't run on initial page load, only when user.id changes!
    const rendersOnMount = process.env.NODE_ENV === "production" ? 1 : 2; // with strict mode it's 2 times
    renderCount.current++;
    if (renderCount.current <= rendersOnMount) {
      return;
    }
    // router.replace(router.asPath);
    window.location.reload();
  }, [user?.id]);

  useEffect(() => {
    // needed: if post was opened from feed (after scrolling in feed) and the
    // user refreshed the page - start from top.
    window.scrollTo(0, 0);
  }, []);

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

      <Post post={postToDisplay} isPostPage={true} />
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { req, res } = ctx;
  let posts;
  try {
    let { db } = await connectToDatabase();
    posts = await db
      .collection("posts")
      .find({ _id: new ObjectId(ctx.params.id) })
      .toArray();
    if (posts.length === 0)
      throw new Error("Couldn't find a post with this _id");
  } catch (error) {
    return {
      redirect: {
        destination: "/404",
        statusCode: 308,
      },
    };
  }

  let post = posts[0];
  let userCookie = getCookie("user", { req, res });
  if (userCookie) userCookie = JSON.parse(userCookie);
  console.log(userCookie);

  post = {
    _id: post._id,
    url: process.env.AWS_URL_PREFIX + post.objectS3key,
    type: post.type,
    title: post.title,
    postCreationDate: post.postCreationDate,
    uploaderId: post.uploaderId,
    numberOfComments: post.comments.length,
    numberOfLikes: post.likes.length,
    topics: post.topics,
    didLike: userCookie
      ? post.likes.some(userId => userId.equals(userCookie.id))
      : false,
    // isSaved: userCookie
    //   ? userCookie.saved.some(pId => pId.equals(post._id))
    //   : false,
  };

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale, [
        "menu",
        "common",
        "admin",
      ])),
      post: JSON.stringify(post),
    },
  };
}
