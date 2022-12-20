import { useContext, useEffect } from "react";
import { useState } from "react";
import AddComment from "./AddComment";
import axios from "axios";
import OneComment from "./OneComment";
import { getCookie } from "cookies-next";
import { AlertContext } from "../context/AlertContext";
import { UserContext } from "../context/UserContext";
export default function Comments({ postId, increaseCommentsCount }) {
  const [comments, setComments] = useState([]);
  let userCookie = getCookie("user");

  function addCommentLocally(text, date, id) {
    userCookie = JSON.parse(userCookie);

    setComments(prev => [
      {
        text,
        user: userCookie.id,
        date: date, // same format as the dates we fetch from db
        didLike: false,
        name: userCookie.name,
        numberOfLikes: 0,
        id,
      },
      ...prev,
    ]);
    increaseCommentsCount();
  }

  const { add } = useContext(AlertContext);
  const { user } = useContext(UserContext);
  async function handleLikeOfComment(commentId) {
    if (user === null) {
      add({ title: `You must be logged in to like` });
      return;
    }

    // using postId and commentId to make the fetch request...

    try {
      await axios.post("/api/post/likeComment", {
        postId,
        commentId,
      });
      const updatedArray = comments.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            didLike: !c.didLike,
            numberOfLikes: c.didLike
              ? c.numberOfLikes - 1
              : c.numberOfLikes + 1,
          };
        }
        return c;
      });
      setComments(updatedArray);
    } catch (error) {
      console.log(`error`, error);
      add({ title: `Error, can't like right now` });
    }
  }

  useEffect(() => {
    async function fetchComments() {
      let { data } = await axios.get("/api/post/comments", {
        params: { postId },
      });

      setComments(data);
    }
    fetchComments();

    return () => {
      setComments([]);
    };
  }, [postId]);

  return (
    <div>
      <AddComment postId={postId} addCommentLocally={addCommentLocally} />
      <div className="flex flex-col gap-3">
        {comments.map((i, key) => (
          <OneComment
            key={key}
            text={i.text}
            user={i.user}
            date={i.date}
            didLike={i.didLike}
            name={i.name}
            numberOfLikes={i.numberOfLikes}
            likeCallback={handleLikeOfComment}
            id={i.id}
          />
        ))}
      </div>
    </div>
  );
}
