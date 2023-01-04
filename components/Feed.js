import useFetch from "../hooks/useFetch.js";
import { useState, useRef, useCallback, useContext } from "react";
import Post from "./Post.js";
import Loading from "./Loading.js";
import Error from "./Error";
import { UserContext } from "../context/UserContext.js";
import { useEffect } from "react";

export default function Feed({ type }) {
  const [forceRender, setForceRender] = useState(0);
  function tryAgainCallback() {
    setForceRender(prev => prev + 1);
  }

  const { user } = useContext(UserContext);

  const query = JSON.stringify({
    userId: user ? user.id : null, // fetch again if user changes (login/logout)
    type: type, // get different posts, based on the type
  });

  const { loading, error, posts, hasMore } = useFetch(query, forceRender);

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
    <div className="md:p-[8%]">
      {posts.map((post, index) => (
        <Post
          key={post._id}
          animateProp={index >= process.env.NEXT_PUBLIC_HOW_MANY_TO_FETCH}
          post={post}
        />
      ))}
      {hasMore && <div ref={lastPostRef}></div>}
      {loading && !error && posts.length === 0 && (
        <>
          {Array.apply(
            null,
            Array(Number(process.env.NEXT_PUBLIC_HOW_MANY_TO_FETCH))
          ).map((_element, index) => (
            <Post key={index} animateProp={false} />
          ))}
        </>
      )}

      {loading && error === null && <Loading />}

      {error !== null && (
        <Error tryAgainCallback={tryAgainCallback} error={error} />
      )}
    </div>
  );
}
