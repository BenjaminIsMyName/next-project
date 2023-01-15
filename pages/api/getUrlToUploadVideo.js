import S3 from "aws-sdk/clients/s3";
import crypto from "crypto";
import { getCookie } from "cookies-next";
import connectToDatabase from "../../util/mongodb";
import { isLoggedInFunc } from "../../util/authHelpers";

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

  const { isLoggedIn, isAdmin, error, code } = await isLoggedInFunc(req, res);
  if (!isLoggedIn || !isAdmin) {
    res.status(code).json({ error });
    return;
  }

  try {
    // Retrieving name and type from the body of request
    const { name, type } = req.query;

    const ext = name.substring(name.lastIndexOf(".") + 1);
    const key = crypto.randomBytes(32).toString("hex") + `.${ext}`;
    // Setting parameters - ACL will allow us to see a file
    const fileParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Expires: 600, // in seconds
      ContentType: type,
      ACL: "public-read",
    };
    // Generating a signed URL which we'll use to upload a file
    // "putObject" is the type of the request, see: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
    const url = await s3instance.getSignedUrlPromise("putObject", fileParams);
    res.status(200).json({ url, objectS3key: key });
  } catch (error) {
    console.log(`error: ${error}`);
    res.status(400).json({ message: error });
  }
}
