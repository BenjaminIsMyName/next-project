import useFetch from "../hooks/useFetch.js";
import { useState, useRef, useCallback } from "react";
import Post from "./Post.js";
import Loading from "./Loading.js";
import Error from "./Error";

export default function Feed() {
  // this component will render right away 3 times:
  // 1. when the component is first rendered
  // 2. ????
  // 3. when we fetched data in useFetch

  const [forceRender, setForceRender] = useState(0);
  function tryAgainCallback() {
    setForceRender(prev => prev + 1);
  }

  const [from, setFrom] = useState(0);
  const { loading, error, posts, hasMore } = useFetch(
    "/",
    from,
    forceRender,
    []
  );

  const observer = useRef();
  const lastPost = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore)
            setFrom(prevFrom => prevFrom + 5);
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
          key={post.id}
          animateProp={index > 3}
          video={post.video}
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
