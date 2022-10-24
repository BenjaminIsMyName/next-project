import useFetch from "../hooks/useFetch.js";
import { useState, useRef, useCallback, useContext } from "react";
import Post from "./Post.js";
import Loading from "./Loading.js";
import Error from "./Error";
import { UserContext } from "../context/UserContext.js";

export default function Feed() {
  const [forceRender, setForceRender] = useState(0);
  function tryAgainCallback() {
    setForceRender(prev => prev + 1);
  }
  const { user } = useContext(UserContext);
  const { loading, error, posts, hasMore } = useFetch(
    `/${user ? user.id : ""}`, // fetch again if user changes (login/logout)
    forceRender
  );

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
        <Post key={post._id} animateProp={index > 3} post={post} />
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
