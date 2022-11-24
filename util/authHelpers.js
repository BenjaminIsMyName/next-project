import { getCookie } from "cookies-next";
import connectToDatabase from "./mongodb";

export async function isLoggedInFunc(req, res) {
  // step 1: get email from the 'user' cookie
  let email = null;
  try {
    const user = JSON.parse(getCookie("user", { req, res }));
    email = user.email;
  } catch (error) {
    return {
      isLoggedIn: false,
      error: `couldn't get email from cookie`,
      code: 401,
      isAdmin: false,
    };
  }

  // step 2: get token from the 'token' cookie
  let token = null;
  try {
    token = getCookie("token", { req, res });
  } catch (error) {
    console.log(`error`, error);
    return {
      isLoggedIn: false,
      error: `couldn't get token from cookie`,
      code: 401,
      isAdmin: false,
    };
  }

  // step 3: fetch db and check if the user has this cookie and its date didn't expire
  try {
    var { db } = await connectToDatabase();
    let users = await db.collection("users").find({ email }).toArray();

    if (users.length === 0) {
      return {
        isLoggedIn: false,
        error: `user with this email doesn't exist`,
        code: 401,
        isAdmin: false,
      };
    }

    if (users.length > 1) {
      // shouldn't ever reach here

      return {
        isLoggedIn: false,
        error: "no information about this error due to Information security",
        code: 500,
        isAdmin: false,
      };
    }

    var user = users[0];
    let tokenFromDb = user.tokens.find(obj => obj.token === token);

    if (!tokenFromDb) {
      return {
        isLoggedIn: false,
        error: `token is not valid`,
        code: 401,
        isAdmin: false,
      };
    }
    // TODO: check if date didn't expire
    if (tokenFromDb.didLogOut) {
      return {
        isLoggedIn: false,
        error: `token is no longer valid`,
        code: 401,
        isAdmin: false,
      };
    }

    if (user.isAdmin !== true) {
      return {
        isLoggedIn: true,
        error: `user is not an admin`,
        code: 401,
        isAdmin: false,
        db,
        user,
      };
    } else {
      return {
        isLoggedIn: true,
        error: null,
        code: null,
        isAdmin: true,
        db,
        user,
      };
    }
  } catch (err) {
    return {
      isLoggedIn: false,
      error: `failed to connect to DB: ${err}`,
      code: 503,
      isAdmin: false,
    };
  }
}
