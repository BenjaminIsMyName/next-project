import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ObjectId } from "mongodb";
import Post from "../../components/Post";
import { useTranslation } from "next-i18next";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useRef } from "react";
import { useEffect } from "react";
import { isLoggedInFunc } from "../../util/authHelpers";

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
        <meta
          name="description"
          content={t("descriptions.post", {
            postTitle: postToDisplay.title,
          })}
        />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      {/* why did I add this div in commit fdd54361ac29cbe36d68faedf8c0190ce254fa7c ???? seems to work fine without it now... */}
      {/* <div className="overflow-hidden"> */}
      <Post post={postToDisplay} isPostPage={true} />
      {/* </div> */}
    </>
  );
}

/*
 This page is using SSR (Server Side Rendering).
 This is because the likes count constantly changes, and we want to show the latest count.
 Also, other stuff might change: post might get deleted, get edited, etc... 
 But the main reason is: We need to check if the user is logged in, and if so, if he liked the post.
 It is possible to do this with getStaticProps, here is an alternative solution:
    - Use revalidate or on-demand regeneration to show up-to-date data (likes count, etc...)
    - On the client, check if the user is logged in, and if so - make a request to the server to check if the user liked the post.
    - Only then, show the like button as liked or not.
*/

export async function getServerSideProps(ctx) {
  const { req, res } = ctx;
  let post = null;
  const { isLoggedIn, user, db } = await isLoggedInFunc(req, res);
  try {
    post = await db
      .collection("posts")
      .aggregate([
        {
          $match: { _id: ObjectId(ctx.params.id) },
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
      .next(); // same as "toArray() and (after that, after awaiting the data!) [0]"
    if (!post) throw new Error("Couldn't find a post with this _id");
  } catch (error) {
    return {
      notFound: true, // see: https://nextjs.org/docs/api-reference/data-fetching/get-static-props#notfound
    };
  }

  post = {
    _id: post._id,
    ...(post.type === "video"
      ? { url: process.env.AWS_URL_PREFIX + post.objectS3key }
      : {}),
    ...(post.type === "article" ? { editorState: post.editorState } : {}),
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
