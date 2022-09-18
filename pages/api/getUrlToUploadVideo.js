import S3 from "aws-sdk/clients/s3";
import crypto from "crypto";
import { getCookie } from "cookies-next";
import connectToDatabase from "../../util/mongodb";
import { isLoggedInFunc } from "../../util/AuthHelpFunctions";
const s3instance = new S3({
  apiVersion: "2006-03-01",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_FOR_S3,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_FOR_S3,
  },
  signatureVersion: "v4",
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "800mb", // TODO: how much?
    },
  },
};

// this function (api endpoint) provide a signed URL to
// upload the file to the S3 bucket from the client side
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({
      error: `getUrlToUploadVideo is a GET request, not ${req.method}!`,
    });
    return;
  }

  // TODO: validate the user is authrized by its cookie
  // 1. get email from the 'user' cookie
  // 2. get token from the 'token' cookie
  // 3. fetch db and check if the user has this cookie and its date didn't expire
  // 4. check in db if the user is admin

  // // step 1: get email from the 'user' cookie
  // let email = null;
  // try {
  //   const user = JSON.parse(getCookie("user", { req, res }));
  //   email = user.email;
  // } catch (error) {
  //   console.log(`error`, error);
  //   res.status(401).json({ error: `couldn't get email from cookie` });
  //   return;
  // }

  // // step 2: get token from the 'token' cookie
  // let token = null;
  // try {
  //   token = getCookie("token", { req, res });
  // } catch (error) {
  //   console.log(`error`, error);
  //   res.status(401).json({ error: `couldn't get token from cookie` });
  //   return;
  // }

  // // step 3: fetch db and check if the user has this cookie and its date didn't expire
  // try {
  //   var { db } = await connectToDatabase();
  //   let users = await db.collection("users").find({ email }).toArray();

  //   if (users.length === 0) {
  //     res.status(503).json({ error: `user with this email doesn't exist` });
  //     return;
  //   }

  //   if (users.length > 1) {
  //     // shouldn't ever reach here
  //     res.status(500).json({
  //       error: "no information about this error due to Information security",
  //     });
  //     return;
  //   }

  //   var user = users[0];
  //   let tokenFromDb = user.tokens.find(obj => obj.token === token);

  //   if (!tokenFromDb) {
  //     res.status(401).json({ error: `token is not valid` });
  //     return;
  //   }

  //   if (tokenFromDb.didLogOut) {
  //     res.status(503).json({ error: `token is no longer valid` });
  //     return;
  //   }

  //   const tokenCreationDate = new Date(tokenFromDb.tokenCreationDate);
  //   const loggedInUntil = new Date(
  //     tokenCreationDate.getTime() +
  //       process.env.TOKEN_EXPIRATION_IN_MINUTES * 60000
  //   );
  //   if (loggedInUntil < new Date()) {
  //     res.status(503).json({ error: `token expired` });
  //     return;
  //   }

  //   // step 4: check in db if the user is admin
  //   if (user.isAdmin !== true) {
  //     res.status(503).json({ error: `user is not an admin` });
  //     return;
  //   }
  // } catch (err) {
  //   res.status(503).json({ error: `failed to connect to DB: ${err}` });
  //   return;
  // }

  const { isLoggedIn, isAdmin, error, code } = await isLoggedInFunc(req, res);
  if (!isLoggedIn || !isAdmin) {
    res.status(code).json({ error });
    return;
  }

  try {
    // Retrieving name and type from the body of request
    const { name, type } = req.query;

    const ext = name.substring(name.lastIndexOf(".") + 1);

    // Setting parameters - ACL will allow us to see a file
    const fileParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: crypto.randomBytes(32).toString("hex") + `.${ext}`,
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
