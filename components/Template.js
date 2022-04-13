import Aside from "./aside/Aside";
import Rest from "./Rest.js";
import { useState, useRef, useCallback } from "react";
import useFetch from "../hooks/useFetch.js";
import Post from "./Post.js";
import Loading from "./Loading.js";
import Error from "./Error";
import LittleMenu from "./LittleMenu";

export default function Template({ postsProp }) {
  const [isOpen, setIsOpen] = useState(false); // is the aside open (on small screens)?
  const [littleMenuOpen, setLittleMenuOpen] = useState(-1); // is a little menu open? (none: -1, profile menu: 0, notifications menu: 1, search menu: 2)
  const asideRef = useRef();
  function menuOnClickHandler() {
    setIsOpen(!isOpen);
    document.body.classList.toggle("no-scroll");
    asideRef.current.theElement.scrollTop = 0;

    // scroll to the top after it's opened a little bit - needed for Chrome, not for Firefox:

    setTimeout(() => {
      asideRef.current.theElement.scrollTop = 0;
    }, 2);

    setTimeout(() => {
      asideRef.current.theElement.scrollTop = 0;
    }, 5);
  }

  const [forceRender, setForceRender] = useState(0);
  function tryAgainCallback() {
    setForceRender(prev => prev + 1);
  }

  const [from, setFrom] = useState(postsProp.length);
  const { loading, error, posts, hasMore } = useFetch(
    "/",
    from,
    forceRender,
    postsProp
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
      {littleMenuOpen === 0 && (
        <LittleMenu isBigMenuOpen={isOpen}>Profile menu</LittleMenu>
      )}
      {littleMenuOpen === 1 && (
        <LittleMenu isBigMenuOpen={isOpen}>Notifications menu</LittleMenu>
      )}
      {littleMenuOpen === 2 && (
        <LittleMenu isBigMenuOpen={isOpen}>Search menu</LittleMenu>
      )}
      <Aside
        onClick={littleMenuOpen === -1 ? () => {} : () => setLittleMenuOpen(-1)} // bug: if menu A is open, clicking on menu B do as asked and open menu B (and close A), but then THIS onClick is called and it closes it
        littleMenuOpen={littleMenuOpen}
        setLittleMenuOpen={setLittleMenuOpen}
        menuOnClickHandler={menuOnClickHandler}
        isOpen={isOpen}
        ref={asideRef}
      />
      <Rest
        blur={isOpen}
        menuOnClickHandler={menuOnClickHandler}
        onClick={littleMenuOpen === -1 ? () => {} : () => setLittleMenuOpen(-1)}
      >
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

        {/* {loading && error === null && hasMore && posts && posts.length > 0 && (
          <Loading />
        )} */}
        {loading && error === null && <Loading />}

        {error !== null && (
          <Error tryAgainCallback={tryAgainCallback} error={error} />
        )}
      </Rest>
    </>
  );
}
