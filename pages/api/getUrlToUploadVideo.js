import S3 from "aws-sdk/clients/s3";
import crypto from "crypto";
import { getCookie } from "cookies-next";
import connectToDatabase from "../../util/mongodb";
import { isLoggedInFunc } from "../../util/authHelpers";

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

// this function (api endpoint) provide a signed URL to
// upload the file to the S3 bucket from the client side
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({
      error: `getUrlToUploadVideo is a GET request, not ${req.method}!`,
    });
    return;
  }

  // Retrieving name and type from the body of request
  const { name, size } = req.query;

  const sizeInInt = Number(size); // bytes
  const sizeInMb = sizeInInt / 1024 / 1024; // mb

  const ext = name.substring(name.lastIndexOf(".") + 1);
  const key = crypto.randomBytes(32).toString("hex") + `.${ext}`;

  if (sizeInMb > 300) {
    res.status(431).json({ error: "File is too large, the limit is 300mb" });
    return;
  }

  // add this check if you want to limit the type of file (e.g. only mp4):
  // if (ext !== "mp4") {
  // res.status(415).json({ error: "File must be mp4" });
  // return;
  // }

  const { isLoggedIn, isAdmin, error, code } = await isLoggedInFunc(req, res);
  if (!isLoggedIn || !isAdmin) {
    res.status(code).json({ error });
    return;
  }

  try {
    const fileParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Conditions: [
        // in this array you can add many conditions that must be met when uploading a file.
        // see: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_s3_presigned_post.html
        ["content-length-range", sizeInInt - 100, sizeInInt + 100],
        // ["starts-with", "$Content-Type", "video/mp4"], // add this line if you want to limit the type of file (e.g. only mp4)
      ],
      Expires: 60 * 10, // in seconds
      Fields: {
        key: key, // must be unique, to prevent overriding of other files
      },
    };
    // using createPresignedPost and not getSignedUrlPromise because that way we can limit the size of the file.
    const info = s3instance.createPresignedPost(fileParams);
    res.status(200).json({ info, objectS3key: key });
  } catch (error) {
    console.log(`error: ${error}`);
    res.status(400).json({ message: error });
  }
}
