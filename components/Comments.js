import { useEffect } from "react";
import { useState } from "react";
import AddComment from "./AddComment";
import axios from "axios";
import OneComment from "./OneComment";
export default function Comments({ postId, increaseCommentsCount }) {
  const [comments, setComments] = useState([]);

  function addCommentLocally(text) {
    // TODO: also, change the localPost. We need to show the number of comments....
    // TODO: make sure it's the same as the one that got fetched. stringify etc
    setComments(prev => [
      {
        text,
        user: "TODO: get user id from cookie",
        date: JSON.stringify(new Date()),
        didLike: false,
        name: "TODO: get name from cookie",
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
      console.log(`clearing`);
      setComments([]);
    };
  }, [postId]);

  console.log(comments);
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
