import connectToDatabase from "../../util/mongodb";
import { passwordError, emailError, nameError } from "../../util/validate";
import bcrypt from "bcrypt";
import { setCookie } from "cookies-next";
import createToken from "../../util/token";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export default async function handler(req, res) {
  // make sure it's a post request ------------------------
  if (req.method !== "POST") {
    res.status(405).json({
      error: `signup is a POST request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { name, email, password, googleToken } = req.body;

  if (googleToken) {
    // validate the token
    try {
      let jwt = JSON.parse(googleToken).credential;
      var {
        userId: googleUserId,
        email: googleEmail,
        name: googleName,
      } = await verify(jwt);
    } catch (error) {
      console.log(`errorrrrrrrrrrr`, error);
    }
  } else {
    if (!name || !email || !password) {
      res.status(406).json({ error: `did not provide all query params` });
      return;
    }

    name = name.trim();
    email = email.trim().toLowerCase();
    // TODO: should probably trim the password too (also in passwordError!!!)

    if (passwordError(password) || emailError(email) || nameError(name)) {
      res.status(406).json({
        error: passwordError(password) || emailError(email) || nameError(name),
      });
      return;
    }
  }

  // connect to db ------------------------
  try {
    var { db } = await connectToDatabase();
  } catch (err) {
    res.status(503).json({ error: `failed to connect to DB: ${err}` });
    return;
  }

  // create token ------------------------
  let { token, tokenCreationDate } = createToken();

  // check if user already exists ------------------------
  try {
    let user = await db
      .collection("users")
      .find({ email: googleToken ? googleEmail : email })
      .toArray();

    // user is logging back with their google account
    if (user.length === 1 && googleToken && user[0].withGoogle) {
      // compare "passwords" (the 'sub' in the payload)
      if (user[0].password != googleUserId) {
        res.status(401).json({ error: `The JWT has been tampered with` });
        return;
      }

      // insert token in DB ------------------------
      try {
        await db.collection("users").findOneAndUpdate(
          { email: googleEmail },
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
      // return token & name ------------------------
      setCookie(
        "user",
        {
          name: user[0].name,
          email: user[0].email,
          id: user[0]._id,
          withGoogle: true,
        },
        {
          req,
          res,
        }
      );
      res.status(204).end();
      return;
    }
    if (user.length > 0) {
      res.status(409).json({
        error: `an account is already associated with this email`,
      });
      return;
    }

    if (user.length > 0 && googleToken) {
    }
  } catch (err) {
    res.status(503).json({
      error: `failed to check if user already exists: ${err}`,
    });
    return;
  }

  // create hash and salt ------------------------
  if (!googleToken) {
    const saltRounds = 10;
    var hashAndSalt = await bcrypt.hash(password, saltRounds);
  }

  // insert in DB ------------------------
  try {
    var { insertedId } = await db.collection("users").insertOne({
      name: googleToken ? googleName : name,
      saved: [],
      email: googleToken ? googleEmail : email,
      password: googleToken ? googleUserId : hashAndSalt,
      tokens: [
        {
          token,
          tokenCreationDate: tokenCreationDate,
          didLogOut: false,
        },
      ],
      userCreationDate: new Date(),
      withGoogle: googleToken ? true : undefined,
    });
  } catch (err) {
    console.log(`error ${err}`);
    res.status(503).json({ error: `failed to add user to DB: ${err}` });
    return;
  }

  setCookie("token", token, { req, res, httpOnly: true });
  // return token & name ------------------------
  setCookie(
    "user",
    {
      name: googleToken ? googleName : name,
      email: googleToken ? googleEmail : email,
      id: insertedId,
      withGoogle: googleToken ? true : undefined,
    },
    {
      req,
      res,
    }
  );
  res.status(204).end();
}

async function verify(jwt) {
  const ticket = await client.verifyIdToken({
    idToken: jwt,
    audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  /*  the payload looks like this: 

  { 
    iss: 'https://accounts.google.com', <<< Issuer (who created and signed this token)
    nbf: 1678726010, <<< Not valid before (seconds since Unix epoch) 
    aud: '51346988821-d8m0q425qo80gb7s8dl99gaooe2iorjv.apps.googleusercontent.com', <<< Audience (who or what the token is intended for)
    sub: '108359022941430644466', <<< Subject (whom the token refers to), user id 
    email: 'theEmail@gmail.com', <<< email address of the user
    email_verified: true, <<< is verified by checking .....???
    azp: '51346988691-d8m0q425qo80gb7s8dl99gaooe2iorjv.apps.googleusercontent.com', <<< Authorized party (the party to which this token was issued)
    name: 'Israel Israeli', <<< name of the user in their google account
    picture: 'https://lh3.googleusercontent.com/a/AGNmyxDSrrfLHZu_GWU-tFum0zU0CwadLs5rt69igWYudQ=s69-c',
    given_name: 'Israel', <<< first name
    family_name: 'Israeli', <<< last name
    iat: 1675722310, <<< Issued at (seconds since Unix epoch)
    exp: 1675729110, <<< Expiration time (seconds since Unix epoch)
    jti: '9c43a56dd728560666b0cb2612bf6cf84428944f' <<< JWT ID (unique identifier for this token)
  }

  */

  return {
    userId: payload["sub"],
    email: payload["email"],
    name: payload["name"],
  };
}
