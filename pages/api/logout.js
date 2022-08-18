import { deleteCookie, getCookie, hasCookie } from "cookies-next";
import connectToDatabase from "../../util/mongodb";
export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    res.status(405).json({
      error: `logout is a DELETE request, not ${req.method}!`,
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
  deleteCookie("token", { req, res });
  deleteCookie("user", { req, res });

  try {
    const { db } = await connectToDatabase();
    await db.collection("users").findOneAndUpdate(
      { email: user.email, "tokens.token": token },
      {
        $set: {
          "tokens.$.didLogOut": true,
        },
      }
    );
  } catch (err) {
    res.status(503).json({
      error: `failed to update database: ${err}`,
    });
    return;
  }

  res.status(204).end();
}
