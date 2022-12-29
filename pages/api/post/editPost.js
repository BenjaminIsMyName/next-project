import { isLoggedInFunc } from "../../../util/authHelpers";
import { titleError } from "../../../util/validate";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.status(405).json({
      error: `editPost is a PUT request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { postId, newTitle } = req.body;

  if (!postId || titleError(newTitle)) {
    res.status(406).json({
      error: titleError(newTitle) || `did not provide postId`,
    });
    return;
  }

  newTitle = newTitle.trim();

  const { isLoggedIn, error, code, db, isAdmin } = await isLoggedInFunc(
    req,
    res
  );
  if (!isLoggedIn || !isAdmin) {
    res.status(code).json({ error });
    return;
  }

  try {
    await db.collection("posts").updateOne(
      { _id: ObjectId(postId) },
      {
        $set: {
          title: newTitle,
        },
      }
    );
  } catch (err) {
    console.log(`error ${err}`);
    res.status(503).json({ error: `failed to edit post in DB: ${err}` });
  }

  res.status(204).end();
}
