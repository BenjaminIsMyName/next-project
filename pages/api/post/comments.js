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
    // todo: get the post, but do JOIN so we'll have the name of the person that commented
    var post = await db.collection("posts").findOne({ _id: ObjectId(postId) });

    // var post = await db.collection("posts").aggregate(pipeline).toArray();
    // user: new ObjectId("631daa4056c5b36fd617cef7"),
    // text: 'fddgfb',
    // liked: [],
    // date:

    if (!post) {
      throw new Error("Something went wrong, post probably doesn't exist");
    }

    var withNames = [];

    for (let i = 0; i < post.comments.length; i++) {
      let userAuthor = await db
        .collection("users")
        .findOne(
          { _id: ObjectId(post.comments[i].user) },
          { projection: { name: 1, _id: 0 } }
        );
      let didLike = post.comments[i].liked.find(id => id.equals(user?._id))
        ? true
        : false;
      withNames.push({
        ...post.comments[i],
        name: userAuthor?.name,
        deletedAccount: userAuthor === null,
        didLike,
        numberOfLikes: post.comments[i].liked.length,
        liked: undefined, // remove the array, no need for it on the client side
      });
    }
  } catch (err) {
    console.log(err);
    res.status(503).json({ error: `failed to get posts from DB: ${err}` });
    return;
  }

  res.status(200).send(withNames.reverse()); // from new to old
}
