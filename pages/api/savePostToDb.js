import { isLoggedInFunc } from "../../util/authHelpers";
import { ObjectId } from "mongodb";
import { titleError } from "../../util/validate";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({
      error: `savePostToDb is a POST request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { title, objectS3key, topics } = req.body;
  // topics are array of strings... for the _id of the topic...

  // TOOD: more checks
  if (titleError(title) || !objectS3key) {
    res.status(406).json({
      error: titleError(title) || "objectS3key is missing",
    });
    return;
  }

  title = title.trim();

  const { isLoggedIn, isAdmin, error, code, db, user } = await isLoggedInFunc(
    req,
    res
  );
  if (!isLoggedIn || !isAdmin) {
    res.status(code).json({ error });
    return;
  }

  // TODO: check if post with this objectS3key already exist (?)
  try {
    var { insertedId } = await db.collection("posts").insertOne({
      objectS3key,
      type: "video",
      title,
      postCreationDate: new Date(),
      uploaderId: new ObjectId(user._id),
      comments: [],
      likes: [],
      topics: topics.map(t => new ObjectId(t._id)),
    });
  } catch (err) {
    console.log("error", err);
    res.status(503).json({ error: `failed to add post to DB: ${err}` });
    return;
  }

  res.status(200).send(insertedId);
}
