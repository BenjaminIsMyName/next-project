import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../context/UserContext";
import { getCookie } from "cookies-next";
import { ThemeContext } from "../context/ThemeContext";
import { useRef } from "react";
function MyApp({ Component, pageProps }) {
  const { locale } = useRouter();

  // on client side only:
  if (typeof window !== "undefined") {
    document.body.dir = locale === "en" ? "ltr" : "rtl";
    document.querySelector("html").dir = locale === "en" ? "ltr" : "rtl";
  }

  // check if user is still logged in (just for UI purposes, using client-side cookie)
  let cookie = getCookie("user") ? JSON.parse(getCookie("user")) : null;

  const [user, setUser] = useState(cookie);

  function setTheme(themeName) {
    document.body.dataset.theme = themeName;
    localStorage.setItem("theme", themeName);
  }

  useEffect(() => {
    // if user logout, remove theme
    // if user in - try to get the theme from localStorage
    setTheme(user ? localStorage.getItem("theme") || "darkgreen" : "darkgreen");
  }, [user]);

  return (
    <ThemeContext.Provider value={{ setTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

export default appWithTranslation(MyApp);
