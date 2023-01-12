import { isLoggedInFunc } from "../../../util/authHelpers";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.status(405).json({
      error: `savrPost is a PUT request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { postId } = req.body;

  if (!postId) {
    res.status(406).json({
      error: `did not provide all query params`,
    });
    return;
  }

  const { isLoggedIn, error, code, db, user } = await isLoggedInFunc(req, res);
  if (!isLoggedIn) {
    res.status(code).json({ error });
    return;
  }

  try {
    // remove from "saved" array if exist, otherwise add. see: https://stackoverflow.com/a/62467491
    let { modifiedCount } = await db.collection("users").updateOne(
      {
        _id: user._id,
      },
      [
        {
          $set: {
            saved: {
              $cond: [
                {
                  $in: [ObjectId(postId), "$saved"],
                },
                {
                  $setDifference: ["$saved", [ObjectId(postId)]],
                },
                {
                  $concatArrays: ["$saved", [ObjectId(postId)]],
                },
              ],
            },
          },
        },
      ]
    );

    if (modifiedCount !== 1) {
      throw new Error("Something went wrong...");
    }
  } catch (err) {
    console.log(`error ${err}`);
    res.status(503).json({ error: `failed to save post: ${err}` });
  }
  res.status(201).end();
}
