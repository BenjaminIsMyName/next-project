import { isLoggedInFunc } from "../../../util/authHelpers";
import { ObjectId } from "mongodb";
import S3 from "aws-sdk/clients/s3";

if (process.env.AWS_ACCESS_KEY_FOR_S3 === undefined) {
  throw new Error("Environment variable AWS_ACCESS_KEY_FOR_S3 is not defined");
}

if (process.env.AWS_SECRET_ACCESS_KEY_FOR_S3 === undefined) {
  throw new Error(
    "Environment variable AWS_SECRET_ACCESS_KEY_FOR_S3 is not defined"
  );
}

if (process.env.AWS_BUCKET_NAME === undefined) {
  throw new Error("Environment variable AWS_BUCKET_NAME is not defined");
}

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
    res.status(405).send({
      error: `deletePost is a DELETE request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { postId } = req.body;

  if (!postId) {
    res.status(406).send({
      error: `did not provide postId`,
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

  try {
    var post = await db
      .collection("posts")
      .findOneAndDelete({ _id: ObjectId(postId) });
  } catch (err) {
    console.log(`error ${err}`);
    res.status(503).send({ error: `failed to delete post from DB: ${err}` });
    return;
  }

  if (post.value.type === "article") {
    res.status(204).end();
    return;
  }

  const fileParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: post.value.objectS3key,
  };

  // ------------ OLD CODE, it will always return 204, even before deleting from s3
  // s3instance.deleteObject(fileParams, (err, _data) => {
  //   if (err) {
  //     console.log(`error ${err}`);
  //   }
  // });

  // res.status(204).end();

  // ------------ NEW CODE, it will wait for the function to complete before returning 204/503
  return new Promise((resolve, reject) => {
    s3instance.deleteObject(fileParams, (err, _data) => {
      // Note: the deleteObject method doesn't throw an error if the object doesn't exist.
      if (err) {
        console.log(`error ${err}`);
        reject();
        res
          .status(503)
          .send({ error: `failed to delete post from S3 bucket: ${err}` });
      } else {
        resolve();
        res.status(204).end();
      }
    });
  });
}
