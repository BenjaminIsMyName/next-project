import { useCallback, useContext, useEffect } from "react";
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
export default function Comments({
  postId,
  increaseCommentsCount,
  setNumberOfComment,
  numberOfComments,
}) {
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
      add({ title: `You must be logged in to like` });
      return;
    }
    // optimistic UI, show the changes before making the API request:
    const updatedArray = comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          didLike: !c.didLike,
          numberOfLikes: c.didLike ? c.numberOfLikes - 1 : c.numberOfLikes + 1,
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
      console.log(`error`, error);
      // if failed, cancel the UI changes that were made
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
      add({ title: `Error, can't like right now` });
    }
  }

  // async function fetchComments() {
  //   setStatus(StatusEnum.loading);
  //   try {
  //     let { data } = await axios.get("/api/post/comments", {
  //       params: { postId },
  //     });
  //     setComments(data);
  //     setStatus(StatusEnum.done);
  //   } catch (error) {
  //     setStatus(StatusEnum.error);
  //   }
  // }

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
    <div>
      <AddComment postId={postId} addCommentLocally={addCommentLocally} />
      {status === StatusEnum.loading && <Loading />}
      {status === StatusEnum.error && (
        <Error
          tryAgainCallback={fetchComments}
          error={t("error-getting-comments")}
        />
      )}
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
            deletedAccount={i.deletedAccount}
          />
        ))}
      </div>
    </div>
  );
}
