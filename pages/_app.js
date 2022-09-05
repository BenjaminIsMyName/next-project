import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import { LangContext } from "../context/LangContext";
import { useState } from "react";
import { getCookie } from "cookies-next";
import { UserContext } from "../context/UserContext";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  // We need to know the language across the entire app.

  const router = useRouter();
  const { locale } = router;

  // on client side only:
  if (typeof window !== "undefined") {
    document.body.dir = locale === "en-US" ? "ltr" : "rtl";
    document.querySelector("html").dir = locale === "en-US" ? "ltr" : "rtl";
  }

  const [language, setLanguage] = useState(locale);
  const [user, setUser] = useState(
    getCookie("user") ? JSON.parse(getCookie("user")) : null
  );

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <LangContext.Provider value={{ language, setLanguage }}>
        <Component {...pageProps} />
      </LangContext.Provider>
    </UserContext.Provider>
  );
}

export default appWithTranslation(MyApp);
