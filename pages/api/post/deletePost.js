import { isLoggedInFunc } from "../../../util/authHelpers";
import { ObjectId } from "mongodb";
import S3 from "aws-sdk/clients/s3";

const s3instance = new S3({
  apiVersion: "2006-03-01",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_FOR_S3,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_FOR_S3,
  },
  signatureVersion: "v4",
});

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    res.status(405).json({
      error: `deletePost is a DELETE request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { postId } = req.body;

  if (!postId) {
    res.status(406).json({
      error: `did not provide postId`,
    });
    return;
  }

  const { isLoggedIn, error, code, db, isAdmin } = await isLoggedInFunc(
    req,
    res
  );
  if (!isLoggedIn || !isAdmin) {
    res.status(code).json({ error });
    return;
  }

  try {
    var post = await db
      .collection("posts")
      .findOneAndDelete({ _id: ObjectId(postId) });
  } catch (err) {
    console.log(`error ${err}`);
    res.status(503).json({ error: `failed to delete post from DB: ${err}` });
  }

  const fileParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: post.value.objectS3key,
  };

  s3instance.deleteObject(fileParams, (err, _data) => {
    if (err) {
      console.log(`error ${err}`);
    }
  });

  res.status(204).end();
}
