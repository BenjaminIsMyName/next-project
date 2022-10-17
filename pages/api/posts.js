import connectToDatabase from "../../util/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") return;
  let { from, amount, type } = req.query;
  from = parseInt(from);
  amount = parseInt(amount);

  // connect to db ------------------------
  try {
    var { db } = await connectToDatabase();
    var posts = await db.collection("posts").find().toArray();
  } catch (err) {
    res.status(503).json({ error: `failed to connect to DB: ${err}` });
    return;
  }

  res.status(200).send({ posts, hasMore: false });
}
