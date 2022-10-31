import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../context/UserContext";
import { getCookie } from "cookies-next";
import { ThemeContext } from "../context/ThemeContext";
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence, motion } from "framer-motion";
import OverlayToContinue from "../components/OverlayToContinue";
import Aside from "../components/aside/Aside";
import { useIdleTimer } from "react-idle-timer";
import styles from "../components/Layout.module.css";

function MyApp({ Component, pageProps }) {
  // next-i18next has a bug - if using translations on top level layout (_app.js), warning appears:
  // the warning: react-i18next:: You will need to pass in an i18next instance by using initReactI18next
  // see: https://github.com/i18next/next-i18next/issues/1917#issuecomment-1258137642
  // So... I used to put the layout (menu etc) in a custom <Layout> component, but...
  // Apparently next.js unmount the entire page when navigating to a different page.
  // Including things that didn't change, like menu.
  // If the page unmount, I can't use AnimatePresence to animate on exit.
  // So... I prefer the warning for now.

  const router = useRouter();
  const locale = router.locale;

  // on client side only:
  if (typeof window !== "undefined") {
    document.body.dir = locale === "en" ? "ltr" : "rtl";
    document.querySelector("html").dir = locale === "en" ? "ltr" : "rtl";
  }

  // check if user is still logged in (just for UI purposes, using client-side cookie)
  let cookie = getCookie("user") ? JSON.parse(getCookie("user")) : null;

  const [user, setUser] = useState(cookie);
  const [askForPassword, setAskForPassword] = useState(false);

  function setTheme(themeName) {
    document.body.dataset.theme = themeName;
    localStorage.setItem("theme", themeName);
  }

  function onIdle() {
    setAskForPassword(true);
  }

  const { start, pause } = useIdleTimer({
    onIdle,
    timeout: 1000 * 60 * process.env.NEXT_PUBLIC_LOGOUT_IN_MINUTES,
    crossTab: true, // TODO: change this?
    startManually: true,
  });

  useEffect(() => {
    if (!user) {
      setAskForPassword(false);
      pause();
      return;
    }

    start();
  }, [user, start, pause]);

  useEffect(() => {
    // if user logout, remove theme
    // if user in - try to get the theme from localStorage
    setTheme(user ? localStorage.getItem("theme") || "darkgreen" : "darkgreen");
  }, [user]);

  return (
    <ThemeContext.Provider value={{ setTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        {askForPassword && (
          <OverlayToContinue onSuccess={() => setAskForPassword(false)} />
        )}
        <Aside />
        <AnimatePresence mode={"wait"}>
          <motion.div
            className={`${styles.rest} ${
              locale === "en" ? styles.restLtr : ""
            }`}
            key={router.route}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeIn" }}
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>

        <Analytics />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

export default appWithTranslation(MyApp);

// TODO: bug in production (npm start) only - CSS modules being removed before AnimatePresence finished to animate the exiting page.
// See: https://rick-moore.medium.com/solution-css-styles-are-removed-too-early-on-page-transitions-with-framer-motion-55d40e6652e
// Also see: https://github.com/vercel/next.js/issues/17464
// Possible solutions:
// 1. Try tailwind?
// 2. Make existing animation super fast, it won't be noticeable?
