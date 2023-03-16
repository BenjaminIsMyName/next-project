import { useRef, useContext, useEffect } from "react";
import Link from "next/link";
import OpenFullIcon from "./icons/OpenFullIcon";
import LikeIcon from "./icons/LikeIcon";
import CommentIcon from "./icons/CommentIcon";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { formatDistance, format } from "date-fns";
import { he } from "date-fns/locale";
import FocusTrap from "focus-trap-react";
import { AlertContext } from "../context/AlertContext";
import CopyIcon from "./icons/CopyIcon";
import ButtonForPost from "./ButtonForPost";
import PostOptions from "./PostOptions";
import AddComment from "./AddComment";
import Comments from "./Comments";
import Balancer from "react-wrap-balancer";
import { useTranslation } from "next-i18next";
import Input from "./Input";
import { titleError } from "../util/validate";
import useLoaded from "../hooks/useLoaded";
import { SoundContext } from "../context/SoundContext";
import scrollParentToChild from "../util/scrollParentToChild";

export default function Post({
  animateProp,
  post,
  isPostPage,
  unsavePostCallback,
}) {
  const { t } = useTranslation(["common", "admin"]);
  const { locale, query, push, route } = useRouter();
  const [localPost, setLocalPost] = useState(post || null); // any change to this post - will just update this state. not the state of all the posts...
  const [canPlay, setCanPlay] = useState(false); // we don't need to use this state atm, just to force render
  const commentsButtonRef = useRef();
  const { sounds } = useContext(SoundContext);

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

  useEffect(() => {
    if (query.scrollToComments && commentsButtonRef.current) {
      setTimeout(() => {
        scrollParentToChild(postRef.current, commentsButtonRef.current, 400);
      }, 400);
    }
  }, [query.scrollToComments]);
  useEffect(() => {
    if (isFullyOpened && !isPostPage) {
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
  }, [isFullyOpened, isPostPage]);

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
      add({ title: `You must be logged in to like` });
      return;
    }
    if (!localPost.didLike) {
      // play sound when liking (not when removing a like)
      sounds.current.like.play();
    }
    // optimistic UI, show the changes before making the API request:
    setLocalPost(prev => ({
      ...prev,
      didLike: !prev.didLike,
      numberOfLikes: prev.didLike
        ? prev.numberOfLikes - 1
        : prev.numberOfLikes + 1,
    }));
    try {
      await axios.post("/api/like", {
        post: localPost._id,
      });
    } catch (error) {
      console.log(`error`, error);
      // if failed, cancel the UI changes that were made
      setLocalPost(prev => ({
        ...prev,
        didLike: !prev.didLike,
        numberOfLikes: prev.didLike
          ? prev.numberOfLikes - 1
          : prev.numberOfLikes + 1,
      }));
      add({ title: `Error, can't like right now` });
    }
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
    add({ title: `Deleting...` });
    try {
      await axios.delete("/api/post/deletePost", {
        data: { postId: localPost._id },
      });
      setIsDeleted(true);
      add({ title: `Deleted!`, color: "success" });
    } catch (error) {
      console.log(error);
      add({ title: `Failed to delete, try again later!` });
    }
  }

  if (isDeleted) {
    return <div></div>;
  }

  async function savePost() {
    add({ title: `Updating database...`, color: "success" });
    try {
      await axios.put("/api/post/savePost", {
        postId: localPost._id,
      });
      setLocalPost(prev => ({ ...prev, isSaved: !prev.isSaved }));
      if (unsavePostCallback) unsavePostCallback(localPost);
    } catch (error) {
      console.log(error);
      add({ title: `Failed to update database, try again later!` });
    }
  }
  const ext = localPost?.url.substring(localPost?.url.lastIndexOf(".") + 1);

  return (
    <FocusTrap
      focusTrapOptions={{
        // -------- if we want any click outside to close the post:
        clickOutsideDeactivates: true,
        escapeDeactivates: true, // default
        onDeactivate: () => {
          // TODO: do we need this? maybe we can just use the default behavior of the FocusTrap.
          // I don't think it does anything... I checked on a topic page etc etc... it doesn't do anything.
          let new_route = route;
          if (route.includes("[id]"))
            new_route = route.replace("[id]", query.id);
          push(new_route, undefined, { scroll: false });
        },
        // -------- if we want to allow clicks outside, but no tabs (NOTE: tiny bugs with this option, check well before changing):
        // allowOutsideClick: true,
      }}
      active={isFullyOpened && !isPostPage} // we need FocusTrap only when the post is opened in the feed
    >
      <div>
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
          className={`bg-second-color text-option-text-color 
          
          ${shouldAnimate ? "opacity-0" : ""} ${
            isFullyOpened
              ? `md:p-5 md:border-[20px] border-main-color  ${
                  // nested conditions
                  isPostPage
                    ? ""
                    : `bg-opacity-50 backdrop-blur-lg top-0 right-0 left-0 bottom-0 fixed pb-[var(--header-height)] z-50 h-full overflow-auto ${
                        locale === "en" // all of this is needed only when the post is fixed on the feed
                          ? "md:left-[var(--aside-width)]"
                          : "md:right-[var(--aside-width)]"
                      }`
                }
                  p-0 border-0`
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
                  query: { post: localPost?._id, id: query.id }, // "id" is for the topicId, when viewing a topic
                }}
                as={localPost ? `/post/${localPost?._id}` : "/"}
              >
                <a
                  aria-label="Open post" // TODO: use i18n for every aria-label
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
          {localPost?.url ? (
            <video
              preload="metadata"
              className={`block w-full max-h-[70vh]`}
              controls
              onCanPlay={() => setCanPlay(true)}
            >
              <source src={localPost?.url} type={`video/${ext}`} />
            </video>
          ) : (
            <div className={`h-80 animate-skeleton`}></div>
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
                aria-label={"Like"}
                className={`bg-opacity-0 border-0`}
                type="button"
                onClick={handleLike}
              >
                <LikeIcon />
              </button>
              <span>{localPost?.numberOfLikes}</span>
            </div>
            <div className="[&_svg]:fill-option-text-color">
              <Link
                scroll={false}
                // shallow={true}
                href={{
                  pathname: `${route}`,
                  query: {
                    post: localPost?._id,
                    id: query.id,
                    scrollToComments: true,
                  }, // "id" is for the topicId, when viewing a topic
                }}
                as={localPost ? `/post/${localPost?._id}` : "/"}
              >
                <a className="flex justify-center">
                  <button
                    aria-label={"Comment"}
                    className={`bg-opacity-0 border-0`}
                    type="button"
                  >
                    <CommentIcon />
                  </button>
                </a>
              </Link>
              <span>{localPost?.numberOfComments}</span>
            </div>
          </div>
          {isFullyOpened && (
            <PostOptions
              post={localPost}
              editClick={() => setIsEditing(true)}
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
