import { useEffect, useRef, useState } from "react";
import { getCookie } from "cookies-next";
import { useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const GoogleStatusEnum = {
  init: "default, maybe the user is connected and refreshed the page... or maybe not",
  loading: "waiting for the fetch to finish",
  error: "error",
  success: "logged in with google successfully now (Didn't refresh page yet)",
};

export default function useGoogle(user, setUser) {
  const router = useRouter();
  const { locale } = router;
  const [status, setStatus] = useState(GoogleStatusEnum.init);
  const [error, setError] = useState({
    text: "",
    statusCode: 0,
  });

  const handleGoogleLogin = useCallback(
    response => {
      console.log(`response`, response);
      async function func(res) {
        setStatus(GoogleStatusEnum.loading);
        try {
          await axios.post("/api/signup", {
            googleToken: JSON.stringify(res),
          });
          const userCookie = getCookie("user");
          setUser(JSON.parse(userCookie));
          setStatus(GoogleStatusEnum.init);
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
  const renderCount = useRef(0);
  useEffect(() => {
    //  run only on initial page load, don't show the prompt again when user is logging out!
    renderCount.current++;
    if (renderCount.current > 1) {
      return;
    }
    if (user) return;
    try {
      setTimeout(() => {
        window.google.accounts.id.prompt(); // also display the One Tap dialog
      }, 2000);
    } catch (error) {
      console.log(`error 2 in useGoogle hook`, error);
    }
  }, [locale, user]);
  return [status, error, GoogleStatusEnum]; // allow other places (Such as EmailForm.js) in the app to access those stuff
}
