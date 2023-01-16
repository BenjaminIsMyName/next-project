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
  let { commentId, postId } = req.body;

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
    let postFromDb = await db
      .collection("posts")
      .find({ _id: ObjectId(postId) })
      .toArray();
    postFromDb = postFromDb[0];

    if (!postFromDb) throw new Error("Post doesn't exist");

    const comment = postFromDb.comments.find(c => c.id === commentId);
    const likeInComment = comment.liked.find(userId => userId.equals(user._id));

    if (likeInComment) {
      // remove the like
      await db.collection("posts").updateOne(
        { _id: ObjectId(postId), "comments.id": commentId },
        {
          $pull: {
            "comments.$.liked": ObjectId(user._id),
          },
        }
      );
    } else {
      // add like
      await db.collection("posts").updateOne(
        { _id: ObjectId(postId), "comments.id": commentId },
        {
          $push: {
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
