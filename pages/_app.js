import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import { useState } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../context/UserContext";
import { getCookie } from "cookies-next";
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

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default appWithTranslation(MyApp);
