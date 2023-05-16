import { isLoggedInFunc } from "../../util/authHelpers";
import { ObjectId } from "mongodb";
import { titleError } from "../../util/validate";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send({
      error: `savePostToDb is a POST request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { title, objectS3key, topics, type, editorState } = req.body;
  // topics are array of strings... for the _id of the topic...

  if (titleError(title)) {
    res.status(406).send({
      error: titleError(title),
    });
    return;
  }

  if (type != "video" && type != "article") {
    res.status(406).send({
      error: "type must be video or article",
    });
    return;
  }

  if (type == "article" && !editorState) {
    res.status(406).send({
      error: "editorState is missing",
    });
    return;
  }

  if (type == "video" && !objectS3key) {
    res.status(406).send({
      error: "objectS3key is missing",
    });
    return;
  }

  title = title.trim();

  const { isLoggedIn, isAdmin, error, code, db, user } = await isLoggedInFunc(
    req,
    res
  );
  if (!isLoggedIn || !isAdmin) {
    res.status(code).send({ error });
    return;
  }

  // TODO: check if post with this objectS3key already exist (?)
  try {
    var { insertedId } = await db.collection("posts").insertOne({
      ...(type === "video" ? { objectS3key } : {}),
      ...(type === "article" ? { editorState } : {}),
      type,
      title,
      postCreationDate: new Date(),
      uploaderId: ObjectId(user._id),
      comments: [],
      likes: [],
      topics: topics.map(id => ObjectId(id)),
    });
  } catch (err) {
    console.log("error", err);
    res.status(503).send({ error: `failed to add post to DB: ${err}` });
    return;
  }

  res.status(200).send(insertedId);
}
