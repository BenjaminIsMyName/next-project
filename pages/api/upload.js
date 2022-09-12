import S3 from "aws-sdk/clients/s3";

const s3instance = new S3({
  apiVersion: "2006-03-01",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  signatureVersion: "v4",
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "800mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.status(405).json({
      error: `user is a PUT request, not ${req.method}!`,
    });
    return;
  }

  try {
    // Retrieving name and type from the body of request
    let { name, type } = req.body;
    // Setting parameters - ACL will allow us to see a file
    console.log(`key is ${name}`);

    const fileParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: name,
      Expires: 600,
      ContentType: type,
      ACL: "public-read",
    };
    // Generating a signed URL which we'll use to upload a file
    const url = await s3instance.getSignedUrlPromise("putObject", fileParams);
    res.status(200).json({ url });
  } catch (error) {
    console.log(`error: ${error}`);
    res.status(400).json({ message: error });
  }
}
