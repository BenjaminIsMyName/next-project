import { isLoggedInFunc } from "../../util/authHelpers";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({
      error: `savePostToDb is a POST request, not ${req.method}!`,
    });
    return;
  }

  const { isLoggedIn, isAdmin, error, code } = await isLoggedInFunc(req, res);
  if (!isLoggedIn || !isAdmin) {
    res.status(code).json({ error });
    return;
  }

  res.status(200).json({ name: "John Doe" });
}
