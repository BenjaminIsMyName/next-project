export function passwordError(pass) {
  if (typeof pass !== "string") return "error-text.password-validation";
  if (pass.length < 6) return "error-text.password-validation";
  if (pass.search(/[a-z]/i) < 0) return "error-text.password-validation";
  if (pass.search(/[0-9]/) < 0) return "error-text.password-validation";
  if (pass.length > 99) return "error-text.password-validation-too-long";
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

export function titleError(title) {
  if (typeof title !== "string") return "error-text.title-validation-required";
  title = title.trim();
  if (title.length < 1) return "error-text.title-validation-required";
  if (title.length > 99) return "error-text.title-validation-too-long";
  return "";
}

export function urlError(url) {
  if (typeof url !== "string") return "error-text.url-validation-required";
  url = url.trim();
  if (url.length < 5) return "error-text.url-validation-too-short";
  if (url.length > 999) return "error-text.url-validation-too-long";
  return "";
}

export function commentError(comment) {
  if (typeof comment !== "string")
    return "error-text.comment-validation-required";
  comment = comment.trim();
  if (comment.length < 1) return "error-text.comment-validation-required";
  if (comment.length > 99) return "error-text.comment-validation-too-long";
  return "";
}

export function topicError(topic) {
  if (typeof topic !== "string") return "error-text.topic-validation-required";
  topic = topic.trim();
  if (topic.length < 1) return "error-text.topic-validation-required";
  if (topic.length > 99) return "error-text.topic-validation-too-long";
  return "";
}
