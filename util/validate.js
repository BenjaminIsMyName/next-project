export function passwordError(pass) {
  if (typeof pass !== "string") return "password must be a string";
  if (pass.length < 6) return "password's length must be at least 6 characters";
  if (pass.search(/[a-z]/i) < 0)
    return "password must contain at least one letter.";

  if (pass.search(/[0-9]/) < 0)
    return "password must contain at least one digit.";

  return "";
}

export function emailError(email) {
  if (typeof email !== "string") return "email must be a string";
  if (
    email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  )
    return "";
  else return "email is not valid";
}

export function nameError(name) {
  if (typeof name !== "string") return "name must be a string";
  if (name.length < 3) return "name's length must be at least 3 characters";
  return "";
}
