import { forwardRef, useCallback, useContext, useEffect } from "react";
import { useState } from "react";
import AddComment from "./AddComment";
import axios from "axios";
import OneComment from "./OneComment";
import { getCookie } from "cookies-next";
import { AlertContext } from "../context/AlertContext";
import { UserContext } from "../context/UserContext";
import Loading from "./Loading";
import Error from "./Error";
import { useTranslation } from "next-i18next";

function CommentsComponent(
  { postId, increaseCommentsCount, setNumberOfComment, numberOfComments },
  ref
) {
  const [comments, setComments] = useState([]);
  const { t } = useTranslation("common");
  const StatusEnum = {
    loading: "Trying to access the backend and get the comments",
    error: "Something went wrong while getting the comments",
    done: "Comments fetched successfully",
  };

  const [status, setStatus] = useState(StatusEnum.loading);
  let userCookie = getCookie("user");

  function addCommentLocally(text, date, id) {
    userCookie = JSON.parse(userCookie);

    setComments(prev => [
      {
        text: text.trim(),
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
      add({ title: t("alerts.log-in-to-like") });
      return;
    }
    // the variables below are used to cancel the UI changes if the API request fails.
    // We don't want to simply set the state to the previous value because setState is async.
    // The bug is that if the user is offline, the UI will show the changes even though the API request failed.
    // The solution is to use the variables below to cancel the UI changes if the API request fails.
    let shouldShowLike = true;
    let numberOfLikes = 0;
    // optimistic UI, show the changes before making the API request:
    const updatedArray = comments.map(c => {
      if (c.id === commentId) {
        shouldShowLike = !c.didLike;
        numberOfLikes = shouldShowLike
          ? c.numberOfLikes + 1
          : c.numberOfLikes - 1;
        return {
          ...c,
          didLike: shouldShowLike,
          numberOfLikes: numberOfLikes,
        };
      }
      return c;
    });
    setComments(updatedArray);

    // using postId and commentId to make the fetch request...

    try {
      await axios.post("/api/post/likeComment", {
        postId,
        commentId,
      });
    } catch (error) {
      shouldShowLike = !shouldShowLike;
      numberOfLikes = shouldShowLike ? numberOfLikes + 1 : numberOfLikes - 1;
      console.log(`error`, error);
      // if failed, cancel the UI changes that were made
      const updatedArray = comments.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            didLike: shouldShowLike,
            numberOfLikes: numberOfLikes,
          };
        }
        return c;
      });
      setComments(updatedArray);
      add({ title: t("alerts.error-liking-comment") });
    }
  }

  const fetchComments = useCallback(async () => {
    setStatus(StatusEnum.loading);
    try {
      let { data } = await axios.get("/api/post/comments", {
        params: { postId },
      });
      setComments(data);
      setStatus(StatusEnum.done);
    } catch (error) {
      setStatus(StatusEnum.error);
    }
  }, [StatusEnum.done, StatusEnum.error, StatusEnum.loading, postId]); // much like [] because they never change

  useEffect(() => {
    fetchComments();

    return () => {
      setComments([]);
    };
  }, [fetchComments]); // much like [] because it never changes

  // if the data in localPost is not up to date, update it.
  if (comments.length > 0 && comments.length != numberOfComments) {
    setNumberOfComment(comments.length);
  }

  return (
    <div ref={ref}>
      <AddComment postId={postId} addCommentLocally={addCommentLocally} />
      <div className="flex flex-col gap-3 min-h-screen">
        {status === StatusEnum.loading && <Loading />}
        {status === StatusEnum.error && (
          <Error
            tryAgainCallback={fetchComments}
            error={t("error-getting-comments")}
          />
        )}
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
            deletedAccount={i.deletedAccount}
          />
        ))}
      </div>
    </div>
  );
}

const Comments = forwardRef(CommentsComponent);

export default Comments;
