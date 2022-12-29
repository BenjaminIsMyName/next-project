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

export default function Post({ animateProp, post, isPostPage }) {
  const { t } = useTranslation(["common", "admin"]);
  const { locale, query, push, route } = useRouter();
  const [localPost, setLocalPost] = useState(post || null); // any change to this post - will just update this state. not the state of all the posts...
  const [canPlay, setCanPlay] = useState(false); // we don't need to use this state atm, just to force render
  const isFullyOpened = isPostPage
    ? true
    : localPost
    ? query.post === localPost._id
    : false;

  const [shouldAnimate, setShouldAnimate] = useState(animateProp);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(localPost?.title || "");

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
    if (isFullyOpened) {
      document.body.classList.add("no-scroll-in-any-screen-due-to-opened-post");
    } else {
      document.body.classList.remove(
        "no-scroll-in-any-screen-due-to-opened-post"
      );
    }
  }, [isFullyOpened]);

  const observer = useRef();
  const postRef = useRef();

  // those ref and useEffect are needed, in order to know the original height of the post when it's already opened.
  // without them, a bug will happen: when liking a post, the "placeholder" div will update its height and take more space
  const postHeightNotOpenedYetRef = useRef();
  useEffect(() => {
    if (isFullyOpened) return;
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
    try {
      await axios.post("/api/like", {
        post: localPost._id,
      });
      setLocalPost(prev => ({
        ...prev,
        didLike: !prev.didLike,
        numberOfLikes: prev.didLike
          ? prev.numberOfLikes - 1
          : prev.numberOfLikes + 1,
      }));
    } catch (error) {
      console.log(`error`, error);
      add({ title: `Error, can't like right now` });
    }
  }

  // display the date only after we are on the client,
  // because we don't want the server to display the date with its timezone.
  // so only after we are on the client, we'll display the date with the client's timezone.
  // see: https://github.com/vercel/next.js/discussions/35773#discussioncomment-2510947
  // and: https://stackoverflow.com/questions/50883916/how-to-format-time-in-react-ssr-rendered-page-using-client-time-zone
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  let formattedDate = localPost && isClient ? getFormattedDate() : "";

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

  return (
    <FocusTrap
      focusTrapOptions={{
        clickOutsideDeactivates: true,
        escapeDeactivates: true, // default
        onDeactivate: () => {
          push(route, undefined, { scroll: false });
        },
        ///// a little bug with those options (instead of the above). Opening modal (to log in) and clicking ESC will allow the user to move to other posts with TAB
        // allowOutsideClick: true,
        // clickOutsideDeactivates: false,
      }}
      active={isFullyOpened && !isPostPage}
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
              ? `md:p-5 md:border-[20px] border-main-color overflow-auto fixed md:right-[var(--aside-width)] md:left-0 md:bottom-0 top-0 z-50 ${
                  isPostPage ? "" : "bg-opacity-50 backdrop-blur-lg"
                }
                  right-0 p-0 border-0 left-0 bottom-[var(--header-height)]`
              : "mb-5 overflow-hidden"
          } ${
            locale === "en" && isFullyOpened
              ? "!right-0 md:left-[var(--aside-width)] left-0"
              : ""
          }`}
          ref={postRef} // converted from https://reactjs.org/docs/refs-and-the-dom.html#callback-refs to simple ref
        >
          <header className="grid grid-cols-[calc(100%-40px)_auto] justify-center items-center py-5 px-2 gap-2">
            {/* container for the date & title: */}
            <div className={`flex flex-col gap-1 px-2`}>
              {/* the problem is somewhere here, inside the span for the date: */}
              <span
                className={`text-sm ${
                  localPost ? "" : "animate-skeleton w-20 h-6"
                }`}
              >
                {formattedDate}
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
                href={localPost ? `${route}?post=${localPost._id}` : "/"}
                as={localPost ? `/post/${localPost?._id}` : "/"}
              >
                <a
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
              <source src={localPost?.url} type="video/mp4" />
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
                className={`bg-opacity-0 border-0`}
                type="button"
                onClick={handleLike}
              >
                <LikeIcon />
              </button>
              <span>{localPost?.numberOfLikes}</span>
            </div>
            <div className="[&_svg]:fill-option-text-color">
              <button
                className={`bg-opacity-0 border-0`}
                type="button"
                onClick={null}
              >
                <CommentIcon />
              </button>
              <span>{localPost?.numberOfComments}</span>
            </div>
          </div>
          {isFullyOpened && (
            <PostOptions
              post={localPost}
              editClick={() => setIsEditing(true)}
            />
          )}
          {isFullyOpened && (
            <Comments
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
