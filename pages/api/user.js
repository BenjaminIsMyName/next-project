import connectToDatabase from "../../util/mongodb";
import { emailError } from "../../util/validate";

export default async function handler(req, res) {
  // make sure it's a post request ------------------------
  if (req.method !== "GET") {
    res.status(405).send({
      error: `user is a GET request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { email } = req.query;
  if (!email) {
    res.status(406).send({ error: `did not provide email` });
    return;
  }
  email = email.trim().toLowerCase();
  if (emailError(email)) {
    res.status(406).send({
      error: emailError(email),
    });
    return;
  }

  // connect to db and look for the user ------------------------
  try {
    let { db } = await connectToDatabase();
    var user = await db.collection("users").find({ email }).toArray();
  } catch (err) {
    res.status(503).send({ error: `failed to connect to DB: ${err}` });
    return;
  }

  if (user.length === 1) {
    res.status(200).send({ exists: true, withGoogle: user[0].withGoogle });
  } else if (user.length === 0) {
    res.status(200).send({ exists: false });
  } else {
    // shouldn't ever reach here
    res.status(500).send({
      error: "no information about this error due to Information security",
    });
  }
}
