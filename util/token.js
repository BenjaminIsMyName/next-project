import crypto from "crypto";

export default function createToken() {
  let token = crypto.randomBytes(32).toString("hex");
  let tokenCreationDate = new Date(); // time with UTC of 0.
  const loggedInUntil = new Date(
    tokenCreationDate.getTime() +
      process.env.TOKEN_EXPIRATION_IN_MINUTES * 60000
  );
  return { token, tokenCreationDate, loggedInUntil };
}
