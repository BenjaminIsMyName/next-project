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

export default function Post({ animateProp, post }) {
  const [isFullyOpened, setIsFullyOpened] = useState(false);
  const [alreadyAnimated, setAlreadyAnimated] = useState(false);

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
  const animate = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          node.classList.add(styles.animate);
          setAlreadyAnimated(true);
        }
      },
      { rootMargin: "200px" }
    );
    if (node) observer.current.observe(node);
  }, []);

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
    <>
      {isFullyOpened && <div className={styles.placeholder}></div>}
      <motion.div
        layout
        className={`${styles.post} ${
          animateProp && !alreadyAnimated ? styles.animationStartPoint : ""
        } ${isFullyOpened ? styles.full : ""} ${
          locale === "en" ? styles.fullLtr : ""
        }`}
        ref={animateProp && !alreadyAnimated ? animate : null}
      >
        <header>
          <div
            className={styles.dateAndTitleContainer}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <span className={styles.date}>{localPost?.postCreationDate}</span>
            <span
              className={`${styles.title} ${
                localPost?.title ? "" : styles.skeletonText
              }`}
            >
              {localPost?.title}
            </span>
          </div>

          <a
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
          </a>
        </header>
        {localPost?.url ? (
          <video controls>
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
          <div
            className={`${styles.likes} ${
              localPost?.didLike ? styles.liked : ""
            }`}
          >
            <LikeIcon onClick={handleLike} />
            <span>{localPost?.numberOfLikes}</span>
          </div>
          <div className={styles.comments}>
            <CommentIcon />
            <span>{localPost?.numberOfComments}</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}
