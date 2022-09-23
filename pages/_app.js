import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../context/UserContext";
import { getCookie } from "cookies-next";
import { ThemeContext } from "../context/ThemeContext";
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
    document.body.className = themeName;
    localStorage.setItem("theme", themeName);
  }

  // useCallback: don't create this function again on every render, only when user changes.
  // why? so I could put it in the useEffect dependency array without making it run every time.
  // I need to use it in the useEffect, so I must include it in its dependency array
  const getInitTheme = useCallback(
    () => (user ? localStorage.getItem("theme") || "darkgreen" : "darkgreen"), // user exist? try to get the theme from localStorage. if it doesn't exist, or the user is not logged in, use the default
    [user]
  );

  useEffect(() => {
    // if user logout, remove theme
    // if user in - try to get the theme from localStorage
    setTheme(getInitTheme());
  }, [getInitTheme]); // getInitTheme changes whenever 'user' changes

  return (
    <ThemeContext.Provider value={{ init: getInitTheme(), setTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

export default appWithTranslation(MyApp);
