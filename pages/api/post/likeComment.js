import { isLoggedInFunc } from "../../../util/authHelpers";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({
      error: `likeComment is a POST request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { commentId, postId, like } = req.body;

  if (!commentId || !postId) {
    res.status(406).json({ error: `did not provide all query params` });
    return;
  }

  const { isLoggedIn, error, code, db, user } = await isLoggedInFunc(req, res);
  if (!isLoggedIn) {
    res.status(code).json({ error });
    return;
  }

  try {
    if (like) {
      // add like
      await db.collection("posts").updateOne(
        { _id: ObjectId(postId), "comments.id": commentId },
        {
          // $addToSet will only add the id if it doesn't already exist.
          // This is to prevent the same user from liking the same comment twice by sending two api requests quickly.
          // when sending quickly, the second call will start before the first call finishes, so the like will be added twice.
          // because the "likeInComment" variable will be false for both calls.
          // this problem is known as Race Condition.
          $addToSet: {
            "comments.$.liked": ObjectId(user._id),
          },
        }
      );
    } else {
      // remove the like
      await db.collection("posts").updateOne(
        { _id: ObjectId(postId), "comments.id": commentId },
        {
          $pull: {
            "comments.$.liked": ObjectId(user._id),
          },
        }
      );
    }
  } catch (err) {
    console.log(`error ${err}`);
    res
      .status(503)
      .json({ error: `failed to add/remove like of comment in DB: ${err}` });
    return;
  }
  res.status(204).end();
}
