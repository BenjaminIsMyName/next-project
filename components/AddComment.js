import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { AlertContext } from "../context/AlertContext";
import { UserContext } from "../context/UserContext";

export default function AddComment({ postId, addCommentLocally }) {
  const [comment, setComment] = useState("");
  const { add } = useContext(AlertContext);
  const { user } = useContext(UserContext);
  const StatusEnum = {
    initial: "Nothing happened yet",
    loading: "Trying to access the backend and save the comment",
    error: "Something went wrong while saving the comment",
    done: "Comment added successfully",
  };
  const [status, setStatus] = useState(StatusEnum.initial);

  async function putComment() {
    if (user === null) {
      add({ title: `You must be logged in to comment` });
      return;
    }

    setStatus(StatusEnum.loading);
    try {
      const { data } = await axios.put("/api/post/addComment", {
        postId,
        comment: comment,
      });
      const { date, id } = data;
      setStatus(StatusEnum.done);
      setComment("");
      add({ title: "Comment added!", color: "success" });
      addCommentLocally(comment, date, id);
    } catch (error) {
      console.log(error);
      setStatus(StatusEnum.error);
    }
  }

  return (
    <div className="py-4 px-4 md:px-0">
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        className="block resize-none w-full h-20 bg-main-color shadow-inner shadow-shadows-color p-3"
        placeholder="Write a comment..."
      ></textarea>
      <button
        onClick={putComment}
        disabled={comment.length === 0 || status === StatusEnum.loading}
        type="button"
        className={`block bg-third-color w-full p-2 mt-2 text-main-color transition-all 
        ${comment.length === 0 ? "bg-opacity-80" : ""}
        ${status === StatusEnum.loading ? "bg-opacity-80 rounded-lg" : ""}`}
      >
        {status === StatusEnum.loading
          ? "Loading..."
          : comment.length === 0
          ? "Write something..."
          : "Send comment"}
      </button>

      <span className="text-error-color block mt-1 h-6 text-sm">
        {status === StatusEnum.error ? "Something went wrong, try again" : ""}
      </span>
    </div>
  );
}
