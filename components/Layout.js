import Aside from "./aside/Aside";
import styles from "./Layout.module.css";
import { useContext } from "react";
import { LangContext } from "../context/LangContext";
export default function Layout({ children }) {
  const { language } = useContext(LangContext);
  return (
    <>
      <Aside />
      <div
        className={`${styles.rest} ${
          language === "en-US" ? styles.restLtr : ""
        }`}
      >
        {children}
      </div>
    </>
  );
}
