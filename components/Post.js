import { useRef, useCallback } from "react";
import styles from "./Post.module.css";
import Link from "next/link";
import OpenFullIcon from "./icons/OpenFullIcon";
import LikeIcon from "./icons/LikeIcon";
import CommentIcon from "./icons/CommentIcon";
export default function Post({ title, animateProp, video, urlKey }) {
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
  return (
    <div
      className={`${styles.post} ${
        animateProp ? styles.animationStartPoint : ""
      }`}
      ref={animateProp ? animate : null}
    >
      <header>
        <span className={`${styles.title} ${title ? "" : styles.skeletonText}`}>
          {title}
        </span>
        <Link href={urlKey ? `/post/${urlKey}` : ""}>
          <a className={`${styles.open} ${urlKey ? "" : styles.skeletonOpen}`}>
            {urlKey && <OpenFullIcon />}
          </a>
        </Link>
      </header>
      {video ? (
        <video controls>
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <div className={styles.skeletonVideo}></div>
      )}

      <div
        className={`${styles.likeAndCommentContainer} ${
          title ? "" : styles.skeletonFooter
        }`}
      >
        <div className={styles.likes}>
          <LikeIcon />
          <span>{title && 224}</span>
        </div>
        <div className={styles.comments}>
          <CommentIcon />
          <span>{title && 12}</span>
        </div>
      </div>
    </div>
  );
}
