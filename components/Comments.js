import { useEffect } from "react";
import { useState } from "react";
import AddComment from "./AddComment";
import axios from "axios";
import OneComment from "./OneComment";
import { getCookie } from "cookies-next";
export default function Comments({ postId, increaseCommentsCount }) {
  const [comments, setComments] = useState([]);
  let userCookie = getCookie("user");

  function addCommentLocally(text) {
    userCookie = JSON.parse(userCookie);
    setComments(prev => [
      {
        text,
        user: userCookie.id,
        date: new Date().toISOString(), // same format as the dates we fetch from db
        didLike: false,
        name: userCookie.name,
        numberOfLikes: 0,
      },
      ...prev,
    ]);
    increaseCommentsCount();
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
            likeCallback={null}
          />
        ))}
      </div>
    </div>
  );
}
