import { getCookie } from "cookies-next";
import { isLoggedInFunc } from "../../util/authHelpers";
import connectToDatabase from "../../util/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({
      error: `getSaved is a GET request, not ${req.method}!`,
    });
    return;
  }
  const { isLoggedIn, error, code, db, user } = await isLoggedInFunc(req, res);
  if (!isLoggedIn) {
    res.status(code).json({ error });
    return;
  }

  // Fetch posts:
  try {
    let userFromDb = await db
      .collection("users")
      .findOne({ _id: ObjectId(user._id) });

    var actualPosts = await db
      .collection("posts")
      .find({ _id: { $in: userFromDb.saved } })
      .toArray();
  } catch (err) {
    console.log(err);
    res.status(503).json({ error: `failed to get posts from DB: ${err}` });
    return;
  }

  // Remove unnecessary data, show "didLike" etc
  const customize = actualPosts.map(p => {
    return {
      _id: p._id,
      url: process.env.AWS_URL_PREFIX + p.objectS3key,
      type: p.type,
      title: p.title,
      postCreationDate: p.postCreationDate,
      uploaderId: p.uploaderId,
      numberOfComments: p.comments.length,
      numberOfLikes: p.likes.length,
      topics: p.topics,
      didLike: p.likes.some(userId => userId.equals(user._id)),
      isSaved: true,
    };
  });
  res.status(200).send({ posts: customize });
}