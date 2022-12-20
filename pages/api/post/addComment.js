import { isLoggedInFunc } from "../../../util/authHelpers";
import { ObjectId } from "mongodb";
const { randomUUID } = require("crypto");

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.status(405).json({
      error: `addComment is a PUT request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { postId, comment } = req.body;

  if (!postId || !comment) {
    res.status(406).json({ error: `did not provide all query params` });
    return;
  }

  const { isLoggedIn, error, code, db, user } = await isLoggedInFunc(req, res);
  if (!isLoggedIn) {
    res.status(code).json({ error });
    return;
  }
  let id = randomUUID();
  let date = new Date();
  try {
    let { modifiedCount } = await db.collection("posts").updateOne(
      { _id: ObjectId(postId) },
      {
        $push: {
          comments: {
            user: ObjectId(user._id),
            text: comment,
            liked: [],
            date,
            id,
          },
        },
      }
    );
    if (modifiedCount !== 1) {
      throw new Error("Something went wrong, post probably doesn't exist");
    }
  } catch (err) {
    console.log(`error ${err}`);
    res.status(503).json({ error: `failed to add comment to DB: ${err}` });
  }
  res.status(200).send({ id, date });
}
