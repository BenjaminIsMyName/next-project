import connectToDatabase from "../../util/mongodb";
import { passwordError, emailError, nameError } from "../../util/validate";
import bcrypt from "bcrypt";
import { setCookie } from "cookies-next";
import createToken from "../../util/token";
export default async function handler(req, res) {
  // make sure it's a post request ------------------------
  if (req.method !== "POST") {
    res.status(405).json({
      error: `login is a POST request, not ${req.method}!`,
    });
    return;
  }

  let { email, password } = req.body;

  if (!email || !password) {
    res.status(406).json({ error: `did not provide all query params` });
    return;
  }

  if (emailError(email)) {
    res.status(406).json({
      error: emailError(email),
    });
    return;
  }

  // connect to db ------------------------
  try {
    var { db } = await connectToDatabase();
    let users = await db.collection("users").find({ email }).toArray();

    if (users.length === 0) {
      res.status(503).json({ error: `user with this email doesn't exist` });
      return;
    }

    if (users.length > 1) {
      // shouldn't ever reach here
      res.status(500).json({
        error: "no information about this error due to Information security",
      });
      return;
    }

    var user = users[0];

    let isOk = await bcrypt.compare(password, user.password);

    if (!isOk) {
      res.status(401).json({ error: `wrong password` });
      return;
    }
  } catch (err) {
    res.status(503).json({ error: `failed to connect to DB: ${err}` });
    return;
  }

  // create token ------------------------
  let { token, tokenCreationDate, loggedInUntil } = createToken();

  // insert token in DB ------------------------
  try {
    await db.collection("users").updateOne(
      { email },
      {
        $push: {
          tokens: {
            token,
            tokenCreationDate: tokenCreationDate,
            didLogOut: false,
          },
        },
      }
    );
  } catch (err) {
    console.log(`error ${err}`);
    res.status(503).json({ error: `failed to add token to DB: ${err}` });
    return;
  }

  setCookie("token", token, { req, res, httpOnly: true });
  setCookie("user", JSON.stringify({ name: user.name, loggedInUntil, email }), {
    req,
    res,
  });
  res.status(204).end();
}