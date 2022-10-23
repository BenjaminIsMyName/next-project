import useFetch from "../hooks/useFetch.js";
import { useState, useRef, useCallback } from "react";
import Post from "./Post.js";
import Loading from "./Loading.js";
import Error from "./Error";

export default function Feed() {
  const [forceRender, setForceRender] = useState(0);
  function tryAgainCallback() {
    setForceRender(prev => prev + 1);
  }

  const { loading, error, posts, hasMore } = useFetch("/", forceRender);

  const observer = useRef();
  const lastPost = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore)
            setForceRender(prev => prev + 1);
        },
        { rootMargin: "150px" }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  return (
    <>
      {posts.map((post, index) => (
        <Post
          title={post.title}
          key={post._id}
          urlKey={post._id}
          animateProp={index > 3}
          video={post.url}
          numberOfLikes={post.likes.length}
          numberOfComments={post.comments.length}
        />
      ))}
      {hasMore && <div ref={lastPost}></div>}
      {loading && !error && posts.length === 0 && (
        <>
          <Post animateProp={false} />
          <Post animateProp={false} />
          <Post animateProp={false} />
          <Post animateProp={false} />
        </>
      )}

      {loading && error === null && <Loading />}

      {error !== null && (
        <Error tryAgainCallback={tryAgainCallback} error={error} />
      )}
    </>
  );
}
