import useFetch from "../hooks/useFetch.js";
import { useState, useRef, useCallback, useContext } from "react";
import Post from "./Post.js";
import Loading from "./Loading.js";
import Error from "./Error";
import { UserContext } from "../context/UserContext.js";
import { useEffect } from "react";

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
  const lastPostRef = useRef();
  // for the IntersectionObserver, to fetch more when scrolling
  useEffect(() => {
    if (!lastPostRef.current) return;
    function handleIntersection(entries) {
      if (entries[0].isIntersecting && hasMore && !loading)
        setForceRender(prev => prev + 1);
    }
    const options = {
      rootMargin: "150px",
    };
    observer.current = new IntersectionObserver(handleIntersection, options);
    observer.current.observe(lastPostRef.current);

    return () => observer.current?.disconnect();
  }, [hasMore, loading]);

  return (
    <>
      {posts.map((post, index) => (
        <Post key={post._id} animateProp={index > 3} post={post} />
      ))}
      {hasMore && <div id="last" ref={lastPostRef}></div>}
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
