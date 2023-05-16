import { getCookie, setCookie } from "cookies-next";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.status(405).send({
      error: `reSetCookies is a PUT request, not ${req.method}!`,
    });
    return;
  }

  // validate params ------------------------
  let { isPWA } = req.body;

  if (typeof isPWA !== "boolean") {
    res.status(400).send({
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
      .send({ error: `the 'user' or 'token' cookie doesn't exist` });
    return;
  }

  try {
    user = JSON.parse(user);
  } catch (err) {
    res.status(503).send({
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
    httpOnly: true, // Cookie is accessible only via HTTP(S), not by client-side JavaScript
    sameSite: "strict", // Cookie is sent only in a first-party context
    secure: true, // Cookie is sent only over HTTPS, not over unencrypted HTTP
  });

  res.status(201).end();
}
