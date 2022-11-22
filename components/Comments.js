import { useEffect } from "react";
import { useState } from "react";
import AddComment from "./AddComment";

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);

  function addCommentLocally(text) {
    setComments(prev => [
      { text, user: "TODO: get user id from cookie", liked: [] },
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
