import connectToDatabase from "../../util/mongodb";
import { emailError } from "../../util/validate";
export default async function handler(req, res) {
  // steps:
  // * validate params and check it's a post request - error if not
  // * connect to db - error if couldn't
  // * check if user exists already - error if so
  // * create hash and salt
  // * create token
  // * insert in db everything (including the date in which the user was created)
  // * return token & name

  // TODO:
  // * check what is the best way to save dates in MongoDB
  // * make the cookie httpOnly, expire automatically after x time, etc
  // * read https://stackoverflow.com/questions/549/the-definitive-guide-to-form-based-website-authentication#477579
  // * understand how long the token should be saved for, what happens after etc

  // make sure it's a post request ------------------------
  if (req.method !== "GET") {
    res.status(405).json({
      error: `user is a GET request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { email } = req.query;
  if (!email) {
    res.status(406).json({ error: `did not provide email` });
    return;
  }

  if (emailError(email)) {
    res.status(406).json({
      error: emailError(email),
    });
    return;
  }

  // connect to db and look for the user ------------------------
  try {
    let { db } = await connectToDatabase();
    var user = await db.collection("users").find({ email }).toArray();
  } catch (err) {
    res.status(503).json({ error: `failed to connect to DB: ${err}` });
    return;
  }

  if (user.length === 1) {
    res.status(200).json({ exists: true });
  } else if (user.length === 0) {
    res.status(200).json({ exists: false });
  } else {
    // shouldn't ever reach here
    res.status(500).json({
      error: "no information about this error due to Information security",
    });
  }
}
