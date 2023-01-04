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
import useToast from "../hooks/useToast";
import Alerts from "../components/Alerts";
import { AlertContext } from "../context/AlertContext";
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

  // ----------------------------------- auth -----------------------------------
  // how it should be in super-secured apps:
  // user should be logged in as long as he uses the app.
  // when idle for X minutes - user should be logged out (asking for password only).
  // when returning to the app after X minutes - user should be logged out completely.
  // API must check if token expired. token should expire when we log out user.

  //  but this app doesn't need to be super-secure. "log out on idle" shouldn't be a feature.
  // I keep this feature for now because I already built it. But it should be removed.
  // ----------------------------------- auth -----------------------------------

  // check if user is logged in (just for UI purposes, using client-side cookie)
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

  const [add, remove, alerts] = useToast();

  return (
    <AlertContext.Provider value={{ add, remove }}>
      <Alerts alerts={alerts} remove={remove} />
      <ThemeContext.Provider value={{ setTheme }}>
        <UserContext.Provider value={{ user, setUser }}>
          {askForPassword && (
            <OverlayToContinue onSuccess={() => setAskForPassword(false)} />
          )}
          <Aside />
          <AnimatePresence mode={"wait"}>
            <motion.div
              // we add padding to the bottom only on small screens (md:p-0) to not overlap the menu's header.
              className={`bg-main-color transition-[width] duration-1000 ease-in
                        min-h-screen isolate overflow-x-hidden 
                        w-full p-[0_0_var(--header-height)_0] md:p-0 
                        md:w-[calc(100%-var(--aside-width))] 
            ${locale === "en" ? "float-right" : "float-left"}`} // this is the div that contains the actual content of the page, next to the menu.
              key={router.route}
              initial={{ opacity: 0, y: -400 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 400 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>

          <Analytics />
        </UserContext.Provider>
      </ThemeContext.Provider>
    </AlertContext.Provider>
  );
}

export default appWithTranslation(MyApp);
