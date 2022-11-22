import { getCookie } from "cookies-next";
import { isLoggedInFunc } from "../../../util/authHelpers";
import connectToDatabase from "../../../util/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({
      error: `comments is a GET request, not ${req.method}!`,
    });
    return;
  }

  let { postId } = req.query;

  const { isLoggedIn, user } = await isLoggedInFunc(req, res);

  // Fetch posts:
  try {
    const { db } = await connectToDatabase();
    var post = await db.collection("posts").findOne({ _id: ObjectId(postId) });
  } catch (err) {
    console.log(err);
    res.status(503).json({ error: `failed to get posts from DB: ${err}` });
    return;
  }

  // TODO: mark comments that got liked by this user (if logged in), map the comments to show relevant data

  res.status(200).send({ posts: customize, hasMore: posts.length > AMOUNT });
}
