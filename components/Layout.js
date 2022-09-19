import Aside from "./aside/Aside";
import styles from "./Layout.module.css";
import { useContext } from "react";
import { LangContext } from "../context/LangContext";
import { useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import OverlayToContinue from "./OverlayToContinue";

export default function Layout({ children }) {
  const { language } = useContext(LangContext);
  const { user, setUser } = useContext(UserContext);
  const [askForPassowrd, setAskForPassowrd] = useState(false);
  useEffect(() => {
    if (!user) {
      setAskForPassowrd(false);
      return;
    }
    console.log(
      (new Date(user.loggedInUntil).getTime() - new Date().getTime()) / 1000
    );
    let timeLeft =
      new Date(user.loggedInUntil).getTime() - new Date().getTime(); // in milliseconds
    setTimeout(() => setAskForPassowrd(true), timeLeft - 500); // run it half a second before time ends
  }, [user, setUser]);

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
