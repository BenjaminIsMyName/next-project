import { ObjectId } from "mongodb";
import { isLoggedInFunc } from "../../../util/authHelpers";
import { topicError } from "../../../util/validate";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    res.status(405).json({
      error: `edit is a PATCH request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { hebrew, english, id } = req.body;

  if (topicError(hebrew) || topicError(english)) {
    res.status(406).json({
      error: topicError(hebrew) || topicError(english),
    });
    return;
  }

  hebrew = hebrew.trim();
  english = english.trim();

  const { isLoggedIn, isAdmin, error, code, db, user } = await isLoggedInFunc(
    req,
    res
  );
  if (!isLoggedIn || !isAdmin) {
    res.status(code).json({ error });
    return;
  }

  try {
    await db.collection("topics").updateOne(
      { _id: ObjectId(id) },
      {
        $set: {
          hebrew,
          english,
        },
      }
    );
  } catch (err) {
    console.log("error", err);
    res.status(503).json({ error: `failed to add topic to DB: ${err}` });
    return;
  }

  res.status(204).end();
}
