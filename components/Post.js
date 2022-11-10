import { useRef, useCallback, useContext, useEffect } from "react";
import Link from "next/link";
import OpenFullIcon from "./icons/OpenFullIcon";
import LikeIcon from "./icons/LikeIcon";
import CommentIcon from "./icons/CommentIcon";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { formatDistance } from "date-fns";
import { he } from "date-fns/locale";
import FocusTrap from "focus-trap-react";

export default function Post({ animateProp, post, isPostPage }) {
  const { locale, query, push, route } = useRouter();
  const [localPost, setLocalPost] = useState(post || null); // any change to this post - will just update this state. not the state of all the posts...
  const [canPlay, setCanPlay] = useState(false); // we don't need to use this state atm, just to force render
  const isFullyOpened = isPostPage
    ? true
    : localPost
    ? query.post === localPost._id
    : false;

  function closeFull() {
    push(route, undefined, { scroll: false });
  }

  const [shouldAnimate, setShouldAnimate] = useState(animateProp);

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

  async function handleLike() {
    if (user === null) {
      alert(`You must be logged in to like`);
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
      alert(`Error, can't like right now`);
    }
  }

  return (
    <FocusTrap
      focusTrapOptions={{
        clickOutsideDeactivates: () => {
          closeFull();
          return true;
        },
        escapeDeactivates: true, // default
        onDeactivate: () => {
          closeFull();
        },
        clickOutsideDeactivates: () => {
          closeFull();
          return true;
        },
        ///// a little bug with those options (instead of the above). Opening modal (to log in) and clicking ESC will allow the user to move to other posts with TAB
        // allowOutsideClick: true,
        // clickOutsideDeactivates: false,
      }}
      active={isFullyOpened && !isPostPage}
    >
      <div>
        {/* placeholder... when the post is showing on full screen, put something there in the meantime. same height as the post, same margin  */}
        {isFullyOpened && (
          <div
            style={{
              height: postHeightNotOpenedYetRef.current,
              marginBottom: "20px",
            }}
          ></div>
        )}
        <motion.div
          layout
          className={`bg-second-color min-h-[200px] text-option-text-color overflow-hidden
          
          ${shouldAnimate ? "opacity-0" : ""} ${
            isFullyOpened
              ? `md:p-5 md:border-[20px] border-main-color overflow-auto fixed md:right-[var(--aside-width)] md:left-0 md:bottom-0 top-0 z-50 ${
                  isPostPage ? "" : "bg-opacity-50 backdrop-blur-lg"
                }
                  right-0 p-0 border-0 left-0 bottom-[var(--header-height)]`
              : "mb-5"
          } ${
            locale === "en" && isFullyOpened
              ? "!right-0 md:left-[var(--aside-width)] left-0"
              : ""
          }`}
          ref={postRef} // converted from https://reactjs.org/docs/refs-and-the-dom.html#callback-refs to simple ref
        >
          <header className="grid grid-cols-[calc(100%-40px)_auto] justify-center items-center py-5 px-2 gap-2">
            <div className={`flex flex-col gap-1 px-2`}>
              <span
                className={`text-sm
                ${localPost ? "" : "animate-skeleton w-20 h-6"} 
               `}
              >
                {localPost &&
                  formatDistance(
                    new Date(localPost.postCreationDate),
                    new Date(),
                    {
                      addSuffix: true,
                      locale: locale === "en" ? undefined : he,
                    }
                  )}
              </span>
              <span
                className={`text-2xl
                ${localPost ? "" : "w-[80%] h-9 animate-skeleton"}`}
              >
                {localPost?.title}
              </span>
            </div>
            {isPostPage || (
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
        </motion.div>
      </div>
    </FocusTrap>
  );
}
