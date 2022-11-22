import { useEffect } from "react";
import { useState } from "react";
import AddComment from "./AddComment";

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);

  function addCommentLocally(text) {
    // TODO: make sure it's the same as the one that got fetched. stringify etc
    setComments(prev => [
      {
        text,
        user: "TODO: get user id from cookie",
        liked: [],
        date: new Date(),
      },
      ...prev,
    ]);
  }

  useEffect(() => {
    // TODO: fetch comments via API
  }, []);

  return (
    <div>
      <AddComment postId={postId} addCommentLocally={addCommentLocally} />
      {comments.map((i, key) => (
        <div key={key}>{i.text}</div>
      ))}
    </div>
  );
}
