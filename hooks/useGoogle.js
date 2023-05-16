import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { useCallback } from "react";
import axios from "axios";

const GoogleStatusEnum = {
  init: "default, maybe the user is connected and refreshed the page... or maybe not",
  loading: "waiting for the fetch to finish",
  error: "error",
  success: "logged in with google successfully now (Didn't refresh page yet)",
};

const LoginMethodsEnum = {
  button: "Google Sign In Button. Google calls it 'btn' in the response",
  prompt: "prompt, aka One Tap Dialog. Google calls it 'user' in the response",
};

export default function useGoogle({ setUser }) {
  // TODO: useReducer might be better here, to avoid different states being set at the same time,
  // causing bugs in useEffects such as the one in useGooglePrompt.js
  const [status, setStatus] = useState(GoogleStatusEnum.init);
  const [error, setError] = useState({
    text: "",
    statusCode: 0,
  });

  const [loginMethod, setLoginMethod] = useState(LoginMethodsEnum.button); // default doesn't matter imo
  const [loginOrSignup, setLoginOrSignup] = useState("login"); // default doesn't matter imo

  const handleGoogleLogin = useCallback(
    response => {
      if (response.select_by === "btn") {
        setLoginMethod(LoginMethodsEnum.button);
      } else if (response.select_by === "user") {
        setLoginMethod(LoginMethodsEnum.prompt);
      }
      async function func(res) {
        setStatus(GoogleStatusEnum.loading);
        try {
          const { data } = await axios.post("/api/signup", {
            googleToken: JSON.stringify(res),
          });
          if (data.type === "google signup") {
            setLoginOrSignup("signup");
          } else if (data.type === "google login") {
            setLoginOrSignup("login");
          }
          const userCookie = getCookie("user");
          setUser(JSON.parse(userCookie));
          setStatus(GoogleStatusEnum.success);
        } catch (err) {
          console.log(`error 3 in useGoogle hook`, err);
          setStatus(GoogleStatusEnum.error);
          setError({
            text: err.response?.data.message || err,
            statusCode: err.response?.status,
          });
        }
      }
      func(response);
    },
    [setUser] // same as [] because setUser is a function that doesn't change
  );

  if (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === undefined) {
    throw new Error(
      "Environment variable NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined"
    );
  }

  useEffect(() => {
    /* "Warning: The google.accounts.id.initialize method should be called only once,
    even if you use both One Tap and button in the same web page." */
    try {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
        context: "use",
      });
    } catch (error) {
      console.log(`error 1 in useGoogle hook`, error);
    }
  }, [handleGoogleLogin]); // same as [] because handleGoogleLogin is wrapped in useCallback and doesn't change

  return [
    status,
    error,
    GoogleStatusEnum,
    loginMethod,
    LoginMethodsEnum,
    loginOrSignup,
  ]; // allow other places (Such as ProfileModal.js) in the app to access those stuff
}
