import { isLoggedInFunc } from "../../../util/authHelpers";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.status(405).send({
      error: `savrPost is a PUT request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { postId } = req.body;

  if (!postId) {
    res.status(406).send({
      error: `did not provide all query params`,
    });
    return;
  }

  const { isLoggedIn, error, code, db, user } = await isLoggedInFunc(req, res);
  if (!isLoggedIn) {
    res.status(code).send({ error });
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
    res.status(503).send({ error: `failed to save post: ${err}` });
    return;
  }
  res.status(201).end();
}
