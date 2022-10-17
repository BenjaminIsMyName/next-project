import { useRef, useCallback } from "react";
import styles from "./Post.module.css";
import Link from "next/link";
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
        {urlKey && (
          <Link href={`/post/${urlKey}`}>
            <a className={styles.skeletonPic}></a>
          </Link>
        )}
        <div className={styles.title}>
          {title || <div className={styles.skeletonText}></div>}
        </div>
      </header>
      <div className={styles.content}>
        <div className={styles.skeletonText}></div>
        <div className={styles.skeletonText}></div>
        <div className={styles.skeletonText}></div>
      </div>
      {video ? (
        <video controls>
          <source src={video} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
