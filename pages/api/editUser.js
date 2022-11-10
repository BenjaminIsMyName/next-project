import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { isLoggedInFunc } from "../../util/authHelpers";
import connectToDatabase from "../../util/mongodb";
import { passwordError, emailError, nameError } from "../../util/validate";
import bcrypt from "bcrypt";
export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.status(405).json({
      error: `editUser is a PUT request, not ${req.method}!`,
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

  const { isLoggedIn, error, code, db, user } = await isLoggedInFunc(req, res);
  if (!isLoggedIn) {
    res.status(code).json({ error });
    return;
  }

  // create hash and salt ------------------------
  const saltRounds = 10;
  const hashAndSalt = await bcrypt.hash(password, saltRounds);

  try {
    await db.collection("users").updateOne(
      { email: user.email },
      {
        $set: {
          name,
          email,
          password: hashAndSalt,
        },
      }
    );
  } catch (err) {
    console.log(`error ${err}`);
    res.status(503).json({ error: `failed to edit user in DB: ${err}` });
  }
  setCookie(
    "user",
    {
      name,
      email,
      isAdmin: user.isAdmin ? true : false,
    },
    {
      req,
      res,
    }
  );
  res.status(204).end();
}
