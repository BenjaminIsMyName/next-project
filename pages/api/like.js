import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { isLoggedInFunc } from "../../util/authHelpers";
import connectToDatabase from "../../util/mongodb";
import { passwordError, emailError, nameError } from "../../util/validate";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({
      error: `like is a POST request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { post } = req.body;

  if (!post) {
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
      .find({ _id: ObjectId(post) })
      .toArray();
    postFromDb = postFromDb[0];

    if (!postFromDb) throw new Error("Post doesn't exist");

    const likeInPost = postFromDb.likes.find(userId => userId.equals(user._id));
    if (likeInPost) {
      // remove the like
      await db.collection("posts").updateOne(
        { _id: ObjectId(post) },
        {
          $pull: { likes: ObjectId(user._id) },
        }
      );
    } else {
      // add like
      await db.collection("posts").updateOne(
        { _id: ObjectId(post) },
        {
          $push: {
            likes: ObjectId(user._id),
          },
        }
      );
    }
  } catch (err) {
    console.log(`error ${err}`);
    res.status(503).json({ error: `failed to add/remove like in DB: ${err}` });
    return;
  }
  res.status(204).end();
}
