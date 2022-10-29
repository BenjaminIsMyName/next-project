import { useRef, useCallback, useContext, useEffect } from "react";
import styles from "./Post.module.css";
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

export default function Post({ animateProp, post }) {
  const [isFullyOpened, setIsFullyOpened] = useState(false);
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

  const { locale } = useRouter();
  const observer = useRef();
  const postRef = useRef();

  // for the IntersectionObserver, to apply animation when scrolling:
  useEffect(() => {
    if (!shouldAnimate) return;
    function handleIntersection(entries) {
      let entry = entries[0];
      if (entry.isIntersecting && shouldAnimate) {
        postRef.current.classList.add(styles.animate);
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
  const [localPost, setLocalPost] = useState(post || null); // any change to this post - will just update this state. not the state of all the posts...

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
    <FocusTrap active={isFullyOpened}>
      <div>
        {/* placeholder... when the post is showing on full screen, put something there in the meantime. same height as the post, same margin  */}
        {isFullyOpened && (
          <div
            style={{
              height: postRef.current.offsetHeight,
              marginBottom: "20px",
            }}
          ></div>
        )}
        <motion.div
          layout
          className={`${styles.post} ${
            shouldAnimate ? styles.animationStartPoint : ""
          } ${isFullyOpened ? styles.full : ""} ${
            locale === "en" ? styles.fullLtr : ""
          }`}
          ref={postRef} // converted from https://reactjs.org/docs/refs-and-the-dom.html#callback-refs to simple ref
        >
          <header>
            <div
              className={styles.dateAndTitleContainer}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <span className={styles.date}>
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
                className={`${styles.title} ${
                  localPost?.title ? "" : styles.skeletonText
                }`}
              >
                {localPost?.title}
              </span>
            </div>

            <button
              type="button"
              className={`${styles.open} ${
                localPost?._id ? "" : styles.skeletonOpen
              }`}
              onClick={
                localPost?._id
                  ? () => {
                      setIsFullyOpened(prev => !prev);
                    }
                  : null
              }
            >
              {localPost?._id && <OpenFullIcon />}
            </button>
          </header>
          {localPost?.url ? (
            <video className={styles.media} controls>
              <source src={localPost?.url} type="video/mp4" />
            </video>
          ) : (
            <div className={styles.skeletonVideo}></div>
          )}

          <div
            className={`${styles.likeAndCommentContainer} ${
              isNaN(localPost?.numberOfComments) ||
              isNaN(localPost?.numberOfLikes)
                ? styles.skeletonFooter
                : ""
            }`}
          >
            <div className={`${localPost?.didLike ? styles.liked : ""}`}>
              <button className={styles.btn} type="button" onClick={handleLike}>
                <LikeIcon />
              </button>
              <span>{localPost?.numberOfLikes}</span>
            </div>
            <div>
              <button className={styles.btn} type="button" onClick={null}>
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
