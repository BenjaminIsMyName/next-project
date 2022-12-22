import { isLoggedInFunc } from "../../util/authHelpers";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({
      error: `savePostToDb is a POST request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  const { url, title } = req.body;

  if (!url || !title) {
    // TODO: more validations
    res.status(406).json({ error: `did not provide all query params` });
    return;
  }

  const { isLoggedIn, isAdmin, error, code, db, user } = await isLoggedInFunc(
    req,
    res
  );
  if (!isLoggedIn || !isAdmin) {
    res.status(code).json({ error });
    return;
  }

  // TODO: check if post with this url already exist
  try {
    var { insertedId } = await db.collection("posts").insertOne({
      url,
      type: "video",
      title,
      postCreationDate: new Date(),
      uploaderId: new ObjectId(user._id),
      comments: [],
      likes: [],
      topics: [],
    });
  } catch (err) {
    console.log("error", err);
    res.status(503).json({ error: `failed to add post to DB: ${err}` });
    return;
  }

  res.status(200).send(insertedId);
}
