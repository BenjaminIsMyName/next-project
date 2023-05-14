import { deleteCookie, getCookie, hasCookie } from "cookies-next";
import connectToDatabase from "../../util/mongodb";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    res.status(405).json({
      error: `deleteUser is a DELETE request, not ${req.method}!`,
    });
    return;
  }

  let user = getCookie("user", { req, res });
  const token = getCookie("token", { req, res });

  if (!user) {
    res.status(409).json({ error: `the 'user' cookie doesn't exist` });
    return;
  }

  user = JSON.parse(user);

  try {
    const { db } = await connectToDatabase();

    const { deletedCount } = await db
      .collection("users")
      .deleteOne({ email: user.email, "tokens.token": token });

    if (deletedCount === 0) throw new Error("Couldn't find a user to delete");

    deleteCookie("token", { req, res });
    deleteCookie("user", { req, res });
  } catch (err) {
    res.status(503).json({
      error: `failed to delete user from database: ${err}`,
    });
    return;
  }

  res.status(204).end();
}
