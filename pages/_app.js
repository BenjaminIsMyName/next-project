import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import { LangContext } from "../context/LangContext";
import { useState } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../context/UserContext";
import { getCookie } from "cookies-next";
function MyApp({ Component, pageProps }) {
  // We need to know the language across the entire app.

  const router = useRouter();
  const { locale } = router;

  // on client side only:
  if (typeof window !== "undefined") {
    document.body.dir = locale === "en" ? "ltr" : "rtl";
    document.querySelector("html").dir = locale === "en" ? "ltr" : "rtl";
  }

  // check if user is still logged in (just for UI purposes, using client-side cookie)
  let cookie = getCookie("user") ? JSON.parse(getCookie("user")) : null;
  let loggedInUntil = cookie?.loggedInUntil;

  // if he has only 5 seconds to stay logged in, just show him as logged out already
  if (!loggedInUntil || new Date(loggedInUntil) - 5000 < new Date()) {
    cookie = null;
  }

  const [user, setUser] = useState(cookie);
  const [language, setLanguage] = useState(locale);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <LangContext.Provider value={{ language, setLanguage }}>
        <Component {...pageProps} />
      </LangContext.Provider>
    </UserContext.Provider>
  );
}

export default appWithTranslation(MyApp);
