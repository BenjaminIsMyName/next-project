import { useRef, useContext, useEffect, useCallback } from "react";
import Link from "next/link";
import OpenFullIcon from "./icons/OpenFullIcon";
import LikeIcon from "./icons/LikeIcon";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { formatDistance, format } from "date-fns";
import { he } from "date-fns/locale";
import FocusTrap from "focus-trap-react";
import { AlertContext } from "../context/AlertContext";
import PostOptions from "./PostOptions";
import Comments from "./Comments";
import { useTranslation } from "next-i18next";
import Input from "./Input";
import { titleError } from "../util/validate";
import useLoaded from "../hooks/useLoaded";
import { SoundContext } from "../context/SoundContext";
import GoToComments from "./GoToComments";
import Video from "./Video";
import DisplayRichText from "./DisplayRichText";

export default function Post({
  animateProp,
  post,
  isPostPage,
  unsavePostCallback,
}) {
  const { t } = useTranslation(["common", "admin"]);
  const { locale, query, push, route, back } = useRouter();
  const [localPost, setLocalPost] = useState(post || null); // any change to this post - will just update this state. not the state of all the posts...
  const [canPlay, setCanPlay] = useState(false); // this is here (and not in the Video.js) in order to force render of this entire component, to update the height of the post in ref (postHeightNotOpenedYetRef)
  const commentsButtonRef = useRef();
  const { sounds } = useContext(SoundContext);
  const observer = useRef();
  const postRef = useRef();

  // those ref and useEffect are needed, in order to know the original height of the post when it's already opened.
  // without them, a bug will happen: when liking a post, the "placeholder" div will update its height and take more space
  const postHeightNotOpenedYetRef = useRef();
  useEffect(() => {
    if (isFullyOpened) return;
    if (!postRef.current) return;
    postHeightNotOpenedYetRef.current = postRef.current.offsetHeight;
  });

  const isFullyOpened = isPostPage
    ? true
    : localPost
    ? query.post === localPost._id
    : false;

  const [shouldAnimate, setShouldAnimate] = useState(animateProp);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(localPost?.title || "");
  const [isDeleted, setIsDeleted] = useState(false);

  const StatusEnumForTitle = {
    initial: "Nothing happened yet",
    loading: "Trying to access the backend and save the edited title",
    error: "Something went wrong while saving the title",
    done: "Title saved successfully",
  };
  const [titleEditingStatus, setTitleEditingStatus] = useState(
    StatusEnumForTitle.initial
  );

  const handleScrollToComments = useCallback(() => {
    if (isPostPage) {
      window.scrollTo({
        top: commentsButtonRef.current.offsetTop,
        behavior: "smooth",
      });
    } else if (commentsButtonRef.current) {
      postRef.current.scrollTo({
        top: commentsButtonRef.current.offsetTop - postRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, [isPostPage]);

  useEffect(() => {
    if (query.scrollToComments) handleScrollToComments();
  }, [handleScrollToComments, query.scrollToComments]);

  useEffect(() => {
    if (isFullyOpened && !isPostPage && !isDeleted) {
      // if a post was opened in the feed, it'll be opened in a scrollable fixed div. The body shouldn't be scrollable.
      document.body.classList.add("no-scroll-in-any-screen-due-to-opened-post");
    } else {
      document.body.classList.remove(
        "no-scroll-in-any-screen-due-to-opened-post"
      );
    }
    return () =>
      document.body.classList.remove(
        "no-scroll-in-any-screen-due-to-opened-post"
      );
  }, [isFullyOpened, isPostPage, isDeleted]);

  // for the IntersectionObserver, to apply animation when scrolling:
  useEffect(() => {
    if (!shouldAnimate) return;
    function handleIntersection(entries) {
      let entry = entries[0];
      if (entry.isIntersecting && shouldAnimate) {
        postRef.current.classList.add("animate-fade-up");
        setTimeout(() => {
          setShouldAnimate(false);
        }, 1000);
        observer.current.disconnect(); // don't observe anymore, no need
      }
    }
    const options = {
      rootMargin: "0px",
    };
    observer.current = new IntersectionObserver(handleIntersection, options);
    observer.current.observe(postRef.current);
    return () => observer.current?.disconnect();
  }, [shouldAnimate]);

  const { user } = useContext(UserContext);
  const { add } = useContext(AlertContext);

  async function handleLike() {
    if (user === null) {
      add({ title: t("alerts.log-in-to-like", { ns: "common" }) });
      return;
    }

    let shouldShowLike = false;

    if (!localPost.didLike) {
      // play sound when liking (not when removing a like)
      sounds.current.like.play();
      shouldShowLike = true;
    }
    // optimistic UI, show the changes before making the API request:
    changeLikeLocally();

    try {
      await axios.post("/api/like", {
        post: localPost._id,
        like: shouldShowLike, // adding or removing the like
      });
    } catch (error) {
      console.log(`error`, error);
      // if failed, cancel the UI changes that were made
      changeLikeLocally();
      add({ title: t("alerts.error-liking-post", { ns: "common" }) });
    }
  }

  function changeLikeLocally() {
    setLocalPost(prev => ({
      ...prev,
      didLike: !prev.didLike,
      numberOfLikes: prev.didLike
        ? prev.numberOfLikes - 1
        : prev.numberOfLikes + 1,
    }));
  }

  // display the date only after we are on the client,
  // because we don't want the server to display the date with its timezone.
  // so only after we are on the client, we'll display the date with the client's timezone.
  // see: https://github.com/vercel/next.js/discussions/35773#discussioncomment-2510947
  // and: https://stackoverflow.com/questions/50883916/how-to-format-time-in-react-ssr-rendered-page-using-client-time-zone
  const loaded = useLoaded();

  let formattedDate = localPost && loaded ? getFormattedDate() : "";

  function getFormattedDate() {
    if (isFullyOpened) {
      return format(
        new Date(localPost.postCreationDate),
        "dd MMMM yyyy HH:mm:ss",
        {
          locale: locale === "en" ? undefined : he,
        }
      );
    }
    return formatDistance(new Date(localPost.postCreationDate), new Date(), {
      addSuffix: true,
      locale: locale === "en" ? undefined : he,
    });
  }

  function increaseCommentsCount() {
    setLocalPost(prev => ({
      ...prev,
      numberOfComments: prev.numberOfComments + 1,
    }));
  }

  function setNumberOfComment(n) {
    setLocalPost(prev => ({
      ...prev,
      numberOfComments: n,
    }));
  }

  async function submitTitleChange() {
    setTitleEditingStatus(StatusEnumForTitle.loading);
    try {
      await axios.put("/api/post/editPost", {
        postId: localPost._id,
        newTitle: title,
      });
      setTitleEditingStatus(StatusEnumForTitle.done);
      setIsEditing(false);
      localPost.title = title; // this is now the actual title, change it here too.
    } catch (error) {
      console.log(error);
      setTitleEditingStatus(StatusEnumForTitle.error);
    }
  }

  async function handleDelete() {
    add({ title: t("deleting", { ns: "admin" }) + "..." });
    try {
      await axios.delete("/api/post/deletePost", {
        data: { postId: localPost._id },
      });
      setIsDeleted(true);
      add({ title: t("deleted", { ns: "admin" }), color: "success" });
    } catch (error) {
      console.log(error);
      add({ title: t("error-text.failed-to-delete", { ns: "admin" }) });
    }
  }

  if (isDeleted) {
    return (
      <div
        data-short-description="deletedPost"
        data-description="this empty div will be returned when the post is deleted"
      ></div>
    );
  }

  async function savePost() {
    add({
      title: t("alerts.updating-database", { ns: "common" }),
      color: "success",
    });
    try {
      await axios.put("/api/post/savePost", {
        postId: localPost._id,
      });
      setLocalPost(prev => ({ ...prev, isSaved: !prev.isSaved }));
      if (unsavePostCallback) unsavePostCallback(localPost);
    } catch (error) {
      console.log(error);
      add({ title: t("alerts.failed-to-update-database", { ns: "common" }) });
    }
  }

  return (
    <FocusTrap
      focusTrapOptions={{
        initialFocus: false, // this is needed because if this is enabled - the article will not start from the top when opened! (it will start from the focusable element)
        escapeDeactivates: () => {
          back();
          return true;
        },
        // option 1 (if we want clicks outside to close the post)... (see long comment below to understand why it's better to use this option)
        clickOutsideDeactivates: () => {
          back();
          return true;
        },
        // option 2: (if we want to allow clicks {no tabs} outside of the post without closing it)
        // allowOutsideClick: true,
      }}
      /*
      
      which option to use? option 1 or option 2?
      option 2 might look better at first glance, because it prevents accidental closing of the post when clicking outside of it.
      but it has a problem: when the post is opened, and the user clicks outside of it to change the language, 
      the language will change, but when using the back button in the browser 
      to close the post - the language will change back to the previous language instead of closing the post. because that's 
      the last URL change.

      adding replace="true" to the Links that change the language does not solve the problem.
      first, about "replace": https://nextjs.org/docs/app/api-reference/components/link#replace
      the reason it doesn't help is because when going back - the post WILL be closed, but the 
      language will change back to the previous language, because the url doesn't contain the locale anymore.

      */

      active={isFullyOpened && !isPostPage} // we need FocusTrap only when the post is opened in the feed
    >
      <div
        data-short-description="containerOfPostAndPlaceholderDiv"
        data-description="this div is the container of the post and the placeholder div. It's needed because the focus-trap cannot use a Fragment as its child container"
      >
        {/* placeholder... when the post is showing on full screen, put something there in the meantime. same height as the post, same margin  */}
        {isFullyOpened && !isPostPage && (
          <div
            style={{
              height: postHeightNotOpenedYetRef.current,
              marginBottom: "20px",
            }}
          ></div>
        )}
        <motion.div
          layout
          className={`bg-second-color text-option-text-color ${
            shouldAnimate ? "opacity-0" : ""
          } ${
            isFullyOpened
              ? `md:p-5 md:border-[20px] border-main-color p-0 border-0 ${
                  // nested conditions
                  isPostPage
                    ? ""
                    : `bg-opacity-50 backdrop-blur-lg top-0 right-0 left-0 bottom-0 fixed pb-[var(--header-height)] z-50 h-full 
                    overflow-auto ltr:md:left-[var(--aside-width)] rtl:md:right-[var(--aside-width)]`
                }`
              : "mb-5 overflow-hidden"
          }`}
          ref={postRef} // converted from https://reactjs.org/docs/refs-and-the-dom.html#callback-refs to simple ref
        >
          <header className="grid grid-cols-[calc(100%-40px)_auto] items-center py-5 px-2 gap-2">
            {/* container for the date & title: */}
            <div className={`flex flex-col gap-1 px-2`}>
              <span
                className={`text-sm ${
                  localPost ? "" : "animate-skeleton w-20 h-6"
                }`}
              >
                <span>{formattedDate}</span>

                {/* show topics here when post is open: */}
                {isFullyOpened && (
                  <div
                    className={`inline opacity-60 
                    ${locale === "en" ? "ml-3" : "mr-3"}`}
                  >
                    {localPost?.topics.map((t, i) => (
                      <span key={t._id}>
                        {i > 0 && i < localPost.topics.length ? (
                          <span className="px-1">•</span>
                        ) : (
                          ""
                        )}{" "}
                        {locale === "en" ? t.english : t.hebrew}
                      </span>
                    ))}
                  </div>
                )}
              </span>
              {/* <Balancer> */}
              {/* bug with the Balancer here: Warning: Prop `dangerouslySetInnerHTML` did not match. Server: "self.__wrap_balancer... */}
              {isEditing && isFullyOpened ? (
                <Input
                  placeholder={t("title-placeholder", { ns: "admin" }) + "..."}
                  type={"text"}
                  translationFile="admin"
                  checkErrorCallback={titleError}
                  removeDefaultStyle={true}
                  className={`text-2xl bg-opacity-0 bg-second-color border-2 p-2`}
                  onChange={e => setTitle(e.target.value)}
                  valueObj={{ title }}
                  name={"title"}
                />
              ) : (
                <span
                  className={`break-words text-2xl 
                ${localPost ? "" : "w-[80%] h-9 animate-skeleton"}`}
                >
                  {title}
                </span>
              )}
              {/* </Balancer> */}
            </div>
            {/* button/link to open the post: */}
            {isFullyOpened || (
              <Link
                scroll={false}
                // shallow={true}
                href={{
                  pathname: `${route}`,
                  query: { post: localPost?._id, topic: query.topic },
                }}
                as={localPost ? `/post/${localPost?._id}` : "/"}
              >
                <a
                  aria-label={t("aria-labels.open-post", { ns: "common" })}
                  className={`w-[30px] h-[30px] p-2 transition-[padding] hover:p-1 duration-300 bg-opacity-0 border-0 [&_svg]:fill-option-text-color ${
                    localPost?._id ? "" : "animate-skeleton"
                  }`}
                >
                  {localPost?._id && <OpenFullIcon />}
                </a>
              </Link>
            )}
          </header>
          {isEditing && isFullyOpened && (
            <div className="px-6">
              <button
                type="button"
                className="block bg-opacity-0 w-min m-auto mb-4"
                onClick={() => {
                  setIsEditing(false);
                  setTitle(localPost.title); // return the title to its previous state
                }}
              >
                {t("cancel")}
              </button>
              <button
                onClick={submitTitleChange}
                disabled={
                  titleError(title) ||
                  titleEditingStatus === StatusEnumForTitle.loading
                }
                type="button"
                className={`disabled:opacity-60 disabled:cursor-not-allowed mb-9 w-full block bg-third-color p-2 mt-2 text-main-color transition-all 
        ${title.length === 0 ? "bg-opacity-80" : ""}
        ${
          titleEditingStatus === StatusEnumForTitle.loading
            ? "bg-opacity-80 rounded-lg"
            : ""
        }`}
              >
                {titleEditingStatus === StatusEnumForTitle.loading
                  ? t("loading", { ns: "common" }) + "..."
                  : title.length === 0
                  ? t("write-something", { ns: "common" }) + "..."
                  : titleEditingStatus === StatusEnumForTitle.error
                  ? t("try-again", { ns: "common" })
                  : t("save", { ns: "common" })}
              </button>
            </div>
          )}
          {/* If did not receive any data from database, show the video's skeleton */}
          {(localPost?.type === "video" || !localPost) && (
            <Video
              videoUrl={localPost?.url}
              setCanPlay={setCanPlay}
              canPlay={canPlay}
            />
          )}

          {localPost?.type === "article" && (
            <div>
              {isFullyOpened ? (
                <DisplayRichText dataAsJson={localPost.editorState} />
              ) : (
                <Link
                  scroll={false}
                  // shallow={true}
                  href={{
                    pathname: `${route}`,
                    query: { post: localPost?._id, topic: query.topic },
                  }}
                  as={localPost ? `/post/${localPost?._id}` : "/"}
                >
                  <a>
                    <div className="bg-main-color/50 text-center p-4 hover:bg-third-color/50 transition-colors">
                      <span>SEE ARTICLE</span>
                    </div>
                  </a>
                </Link>
              )}
            </div>
          )}

          <div
            className={`flex justify-evenly content-center py-4 px-2 [&>div]:flex [&>div]:gap-2
            [&>div_svg]:w-5 [&>div_svg]:h-5 [&>div_svg]:cursor-pointer ${
              localPost
                ? ""
                : "[&_span]:h-5 [&_span]:animate-skeleton [&_span]:w-[50px] [&_span]:rounded-[40px] [&_svg]:hidden"
            }`}
          >
            <div
              className={`${
                localPost?.didLike
                  ? "[&_svg]:fill-third-color"
                  : "[&_svg]:fill-option-text-color"
              }`}
            >
              <button
                aria-label={t("aria-labels.like", { ns: "common" })}
                className={`bg-opacity-0 border-0`}
                type="button"
                onClick={handleLike}
              >
                <LikeIcon />
              </button>
              <span>{localPost?.numberOfLikes}</span>
            </div>
            <div className="[&_svg]:fill-option-text-color">
              <GoToComments
                handleScrollToComments={handleScrollToComments}
                isFullyOpened={isFullyOpened}
                localPost={localPost}
                query={query}
                route={route}
              />
              <span>{localPost?.numberOfComments}</span>
            </div>
          </div>
          {isFullyOpened && (
            <PostOptions
              post={localPost}
              editClick={() => {
                setIsEditing(true);
                if (isPostPage) {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                } else {
                  postRef.current.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }
              }}
              deleteClick={handleDelete}
              savePost={savePost}
            />
          )}
          {isFullyOpened && (
            <Comments
              ref={commentsButtonRef}
              increaseCommentsCount={increaseCommentsCount}
              setNumberOfComment={setNumberOfComment}
              numberOfComments={localPost.numberOfComments}
              postId={localPost._id}
            />
          )}
        </motion.div>
      </div>
    </FocusTrap>
  );
}
