import { isLoggedInFunc } from "../../../util/authHelpers";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    res.status(405).json({
      error: `deleteTopic is a DELETE request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { topicId } = req.body;

  if (!topicId) {
    res.status(406).json({
      error: `did not provide postId`,
    });
    return;
  }

  const { isLoggedIn, error, code, db, isAdmin } = await isLoggedInFunc(
    req,
    res
  );
  if (!isLoggedIn || !isAdmin) {
    res.status(code).json({ error });
    return;
  }

  try {
    await db.collection("topics").findOneAndDelete({ _id: ObjectId(topicId) });
    // TODO: remove this topic from every post that contains this topic?
  } catch (err) {
    console.log(`error ${err}`);
    res.status(503).json({ error: `failed to delete topic from DB: ${err}` });
    return;
  }

  res.status(204).end();
}
