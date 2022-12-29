import { isLoggedInFunc } from "../../../util/authHelpers";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    res.status(405).json({
      error: `deletePost is a DELETE request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { postId } = req.body;

  if (!postId) {
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
    await db.collection("posts").deleteOne({ _id: ObjectId(postId) });
  } catch (err) {
    console.log(`error ${err}`);
    res.status(503).json({ error: `failed to delete post from DB: ${err}` });
  }

  res.status(204).end();
}
