import Aside from "./aside/Aside";
import styles from "./Layout.module.css";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import OverlayToContinue from "./OverlayToContinue";
import { useIdleTimer } from "react-idle-timer";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
// Using a layout component instead of using _app.js
// because i18n causes problems when components that use it are in _app.js file:
// see: https://github.com/i18next/next-i18next/issues/1917
// But maybe because of the use of a layout component instead of _app.js there is another issue:
// The entire app gets remounted whenever I go to a different page. see: https://github.com/i18next/next-i18next/issues/1075
// TODO: try removing this component and use _app.js again, maybe the issue will be resolved.
// if not, use a different package, like next-translate or something else
// because, how am I gonna use framer-motion for page transition if the entire page gets unmounted?!

export default function Layout({ children }) {
  const router = useRouter();
  const locale = router.locale;
  const { user, setUser } = useContext(UserContext);
  const [askForPassword, setAskForPassword] = useState(false);

  function onIdle() {
    setAskForPassword(true);
  }

  const {
    start,
    reset,
    activate,
    pause,
    resume,
    isIdle,
    isPrompted,
    isLeader,
    getTabId,
    getRemainingTime,
    getElapsedTime,
    getLastIdleTime,
    getLastActiveTime,
    getTotalIdleTime,
    getTotalActiveTime,
  } = useIdleTimer({
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
  }, [user, setUser, start, reset, pause]);

  return (
    <>
      {askForPassword && (
        <OverlayToContinue onSuccess={() => setAskForPassword(false)} />
      )}
      <Aside />
      <AnimatePresence mode={"wait"}>
        <motion.div
          className={`${styles.rest} ${locale === "en" ? styles.restLtr : ""}`}
          key={router.route}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, background: "red" }}
          transition={{ duration: 3 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
