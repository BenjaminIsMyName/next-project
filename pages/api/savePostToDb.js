export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({
      error: `savePostToDb is a POST request, not ${req.method}!`,
    });
    return;
  }

  // TODO: auth user

  res.status(200).json({ name: "John Doe" });
}
