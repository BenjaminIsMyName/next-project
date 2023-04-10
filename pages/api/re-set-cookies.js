import { getCookie, setCookie } from "cookies-next";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.status(405).json({
      error: `re-set-cookies is a PUT request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { isPWA } = req.body;

  if (typeof isPWA !== "boolean") {
    res.status(400).json({
      error: `isPWA must be a boolean, not ${typeof isPWA}!`,
    });
    return;
  }

  // set cookies ------------------------
  // if PWA, existing/new cookies should be set to expire in 1 year.
  let user = getCookie("user", { req, res });
  let token = getCookie("token", { req, res });

  if (!user || !token) {
    res
      .status(409)
      .json({ error: `the 'user' or 'token' cookie doesn't exist` });
    return;
  }

  try {
    user = JSON.parse(user);
  } catch (err) {
    res.status(503).json({
      error: `failed to parse user cookie: ${err}`,
    });
    return;
  }

  //   set the cookie expiration date
  setCookie("user", user, {
    req,
    res,
    maxAge: isPWA ? 365 * 24 * 60 * 60 : undefined,
  });
  setCookie("token", token, {
    req,
    res,
    maxAge: isPWA ? 365 * 24 * 60 * 60 : undefined,
    httpOnly: true,
  });

  res.status(201).end();
}
