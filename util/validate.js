export function passwordError(pass) {
  if (typeof pass !== "string") return "error-text.password-validation";
  if (pass.length < 6) return "error-text.password-validation";
  if (pass.search(/[a-z]/i) < 0) return "error-text.password-validation";
  if (pass.search(/[0-9]/) < 0) return "error-text.password-validation";
  return "";
}

export function emailError(email) {
  if (typeof email !== "string") return "error-text.email-validation";
  email = email.trim();
  if (
    !email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  )
    return "error-text.email-validation";
  if (email.length > 99) return "error-text.email-validation-too-long";
  return "";
}

export function nameError(name) {
  if (typeof name !== "string") return "error-text.name-validation";
  name = name.trim();
  if (name.length < 2) return "error-text.name-validation";
  if (name.length > 30) return "error-text.name-validation";
  return "";
}
