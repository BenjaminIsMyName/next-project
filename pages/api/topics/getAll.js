import { isLoggedInFunc } from "../../../util/authHelpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).send({
      error: `getAll is a GET request, not ${req.method}!`,
    });
    return;
  }

  const { isLoggedIn, error, code, db, isAdmin } = await isLoggedInFunc(
    req,
    res
  );
  if (!isLoggedIn || !isAdmin) {
    res.status(code).send({ error });
    return;
  }

  // Fetch topics:
  try {
    const topics = await db.collection("topics").find({}).toArray();
    res.status(200).send({ topics });
  } catch (err) {
    console.log(err);
    res.status(503).send({ error: `failed to get topics from DB: ${err}` });
    return;
  }
}
