import { isLoggedInFunc } from "../../../util/authHelpers";
import { topicError } from "../../../util/validate";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({
      error: `create is a POST request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { hebrew, english } = req.body;

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

  // TODO: check if topic with this name already exist (?)
  try {
    var { insertedId } = await db.collection("topics").insertOne({
      hebrew,
      english,
    });
  } catch (err) {
    console.log("error", err);
    res.status(503).json({ error: `failed to add topic to DB: ${err}` });
    return;
  }

  res.status(200).send(insertedId);
}
