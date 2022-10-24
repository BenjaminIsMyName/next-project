import connectToDatabase from "../../util/mongodb";
import { passwordError, emailError, nameError } from "../../util/validate";
import bcrypt from "bcrypt";
import { setCookie } from "cookies-next";
import createToken from "../../util/token";
export default async function handler(req, res) {
  // make sure it's a post request ------------------------
  if (req.method !== "POST") {
    res.status(405).json({
      error: `signup is a POST request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(406).json({ error: `did not provide all query params` });
    return;
  }

  name = name.trim();
  email = email.trim().toLowerCase();

  if (passwordError(password) || emailError(email) || nameError(name)) {
    res.status(406).json({
      error: passwordError(password) || emailError(email) || nameError(name),
    });
    return;
  }

  // connect to db ------------------------
  try {
    var { db } = await connectToDatabase();
  } catch (err) {
    res.status(503).json({ error: `failed to connect to DB: ${err}` });
    return;
  }

  // check if user already exists ------------------------
  try {
    let user = await db.collection("users").find({ email }).toArray();

    if (user.length > 0) {
      res
        .status(409)
        .json({ error: `an account is already associated with this email` });
      return;
    }
  } catch (err) {
    res.status(503).json({
      error: `failed to check if user already exists: ${err}`,
    });
    return;
  }

  // create hash and salt ------------------------
  const saltRounds = 10;
  const hashAndSalt = await bcrypt.hash(password, saltRounds);

  // create token ------------------------
  let { token, tokenCreationDate } = createToken();

  // insert in DB ------------------------
  try {
    const { insertedId } = await db.collection("users").insertOne({
      name,
      email,
      password: hashAndSalt,
      tokens: [
        {
          token,
          tokenCreationDate: tokenCreationDate,
          didLogOut: false,
        },
      ],
      userCreationDate: new Date(),
    });
  } catch (err) {
    console.log(`error ${err}`);
    res.status(503).json({ error: `failed to add user to DB: ${err}` });
    return;
  }

  setCookie("token", token, { req, res, httpOnly: true });
  // return token & name ------------------------
  setCookie("user", JSON.stringify({ name, email, id: insertedId }), {
    req,
    res,
  });
  res.status(204).end();
}
