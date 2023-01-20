import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ObjectId } from "mongodb";
import Post from "../../components/Post";
import { useTranslation } from "next-i18next";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useRef } from "react";
import { useEffect } from "react";
import { isLoggedInFunc } from "../../util/authHelpers";

export default function TopicPage({ posts }) {
  const { t } = useTranslation(["common"]);
  let parsedPosts = JSON.parse(posts);
  console.log("posts in client", parsedPosts);

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
        <meta name="description" content="content" />
        {/* adding "/" before favicon solves a bug, see: 
        https://www.reddit.com/r/nextjs/comments/pnmj9n/comment/hctyraz/?utm_source=share&utm_medium=web2x&context=3
        and: https://github.com/vercel/next.js/discussions/13301 */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="overflow-hidden"></div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { req, res } = ctx;
  let posts = null;
  const { isLoggedIn, user, db } = await isLoggedInFunc(req, res);
  try {
    posts = await db
      .collection("posts")
      .aggregate([
        {
          $match: { topics: { $in: [ObjectId(ctx.params.id)] } },
        },
        {
          $lookup: {
            from: "topics",
            localField: "topics",
            foreignField: "_id",
            as: "actualTopics",
          },
        },
      ])
      .toArray();
  } catch (error) {
    return {
      redirect: {
        destination: "/500",
        statusCode: 308,
      },
    };
  }

  posts = posts.map(post => ({
    _id: post._id,
    url: process.env.AWS_URL_PREFIX + post.objectS3key,
    type: post.type,
    title: post.title,
    postCreationDate: post.postCreationDate,
    uploaderId: post.uploaderId,
    numberOfComments: post.comments.length,
    numberOfLikes: post.likes.length,
    topics: post.actualTopics,
    didLike: isLoggedIn
      ? post.likes.some(userId => userId.equals(user._id))
      : false,
    isSaved: isLoggedIn ? user.saved.some(pId => pId.equals(post._id)) : false,
  }));

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale, [
        "menu",
        "common",
        "admin",
      ])),
      posts: JSON.stringify(posts),
    },
  };
}
