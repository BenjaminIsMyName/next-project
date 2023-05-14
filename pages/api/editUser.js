import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { isLoggedInFunc } from "../../util/authHelpers";
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

  const { isLoggedIn, error, code, db, user } = await isLoggedInFunc(req, res);
  if (!isLoggedIn) {
    res.status(code).json({ error });
    return;
  }

  if (user.withGoogle ? !name : !name || !email || !password) {
    res.status(406).json({ error: `did not provide all query params` });
    return;
  }

  name = name.trim();
  if (!user.withGoogle) {
    email = email.trim().toLowerCase();
  }

  if (
    user.withGoogle
      ? nameError(name)
      : passwordError(password) || emailError(email) || nameError(name)
  ) {
    res.status(406).json({
      error: nameError(name) || passwordError(password) || emailError(email),
    });
    return;
  }

  // create hash and salt ------------------------
  if (!user.withGoogle) {
    const saltRounds = 10;
    var hashAndSalt = await bcrypt.hash(password, saltRounds);
  }

  // check if email is already in use ------------------------
  if (!user.withGoogle && user.email !== email) {
    try {
      const userInDB = await db.collection("users").findOne({ email });
      if (userInDB) {
        res.status(409).json({ error: `email already in use` });
        return;
      }
    } catch (err) {
      console.log(`error ${err}`);
      res.status(503).json({ error: `failed to find user in DB: ${err}` });
      return;
    }
  }

  try {
    await db.collection("users").updateOne(
      { email: user.email },
      {
        $set: user.withGoogle
          ? { name }
          : {
              name,
              email,
              password: hashAndSalt,
            },
      }
    );
  } catch (err) {
    console.log(`error ${err}`);
    res.status(503).json({ error: `failed to edit user in DB: ${err}` });
    return;
  }
  setCookie(
    "user",
    {
      name,
      email: user.withGoogle ? user.email : email,
      isAdmin: user.isAdmin ? true : false,
    },
    {
      req,
      res,
    }
  );
  res.status(204).end();
}
