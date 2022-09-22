import Aside from "./aside/Aside";
import styles from "./Layout.module.css";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import OverlayToContinue from "./OverlayToContinue";
import { useIdleTimer } from "react-idle-timer";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const { locale } = useRouter();

  const { user, setUser } = useContext(UserContext);
  const [askForPassowrd, setAskForPassowrd] = useState(false);

  function onIdle() {
    // Close Modal Prompt
    // Do some idle action like log out your user
    console.log(`onIdle`);
    setAskForPassowrd(true);
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
      setAskForPassowrd(false);
      // reset();
      console.log(`pausing`);
      pause();
      return;
    }
    console.log(`starting`);
    start();
  }, [user, setUser, start, reset, pause]);

  return (
    <>
      {askForPassowrd && (
        <OverlayToContinue onSuccess={() => setAskForPassowrd(false)} />
      )}
      <Aside />
      <div
        className={`${styles.rest} ${locale === "en" ? styles.restLtr : ""}`}
      >
        {children}
      </div>
    </>
  );
}
