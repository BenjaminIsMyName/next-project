import crypto from "crypto";

export default function createToken() {
  let token = crypto.randomBytes(32).toString("hex");
  let tokenCreationDate = new Date(); // time with UTC of 0.
  return { token, tokenCreationDate };
}
