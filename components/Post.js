import { useRef, useCallback, useContext, useEffect } from "react";
import styles from "./Post.module.css";
import Link from "next/link";
import OpenFullIcon from "./icons/OpenFullIcon";
import LikeIcon from "./icons/LikeIcon";
import CommentIcon from "./icons/CommentIcon";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useState } from "react";

export default function Post({ animateProp, post }) {
  const observer = useRef();
  const animate = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) node.classList.add(styles.animate);
      },
      { rootMargin: "200px" }
    );
    if (node) observer.current.observe(node);
  }, []);

  const { user } = useContext(UserContext);
  const [localPost, setLocalPost] = useState(post || null);

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
    <div
      className={`${styles.post} ${
        animateProp ? styles.animationStartPoint : ""
      }`}
      ref={animateProp ? animate : null}
    >
      <header>
        <span
          className={`${styles.title} ${
            localPost?.title ? "" : styles.skeletonText
          }`}
        >
          {localPost?.title}
        </span>
        <Link href={localPost?._id ? `/post/${localPost._id}` : ""}>
          <a
            className={`${styles.open} ${
              localPost?._id ? "" : styles.skeletonOpen
            }`}
          >
            {localPost?._id && <OpenFullIcon />}
          </a>
        </Link>
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
          isNaN(localPost?.numberOfComments) || isNaN(localPost?.numberOfLikes)
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
    </div>
  );
}
