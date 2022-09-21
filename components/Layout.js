import Aside from "./aside/Aside";
import styles from "./Layout.module.css";
import { useContext } from "react";
import { LangContext } from "../context/LangContext";
import { useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import OverlayToContinue from "./OverlayToContinue";
import { useIdleTimer } from "react-idle-timer";

export default function Layout({ children }) {
  const { language } = useContext(LangContext);
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
    timeout: 8000, // 2 minutes
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
        className={`${styles.rest} ${language === "en" ? styles.restLtr : ""}`}
      >
        {children}
      </div>
    </>
  );
}
