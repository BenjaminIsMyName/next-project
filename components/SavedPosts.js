import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import Post from "./Post";

export default function SavedPosts() {
  const [posts, setPosts] = useState([]);

  const StatusEnum = {
    loading: "Getting the saved posts",
    error: "couldn't get the saved posts",
    done: "Something went wrong...",
  };
  const { user } = useContext(UserContext);
  const [status, setStatus] = useState(StatusEnum.loading);
  const userId = user ? user.id : null;
  useEffect(() => {
    async function get() {
      try {
        setStatus(StatusEnum.loading);
        const { data } = await axios.get("/api/getSaved");
        setPosts(data.posts);
        setStatus(StatusEnum.done);
      } catch (error) {
        setStatus(StatusEnum.error);
      }
    }
    window.scrollTo(0, 0); // as we do in all feeds... (search for this line..) because otherwise - going from feed A to feed B will not jump to start
    get();
  }, [StatusEnum.done, StatusEnum.error, StatusEnum.loading, userId]); // same as [userId] because the others never change

  return (
    <>
      {status === StatusEnum.loading &&
        Array.apply(
          null,
          Array(Number(process.env.NEXT_PUBLIC_HOW_MANY_TO_FETCH))
        ).map((_element, index) => <Post key={index} animateProp={false} />)}
      {posts.map(p => (
        <Post
          post={p}
          key={p._id}
          unsavePostCallback={post => {
            setPosts(prev => prev.filter(i => i._id != post._id));
          }}
        />
      ))}
    </>
  );
}
