import styles from "./Rest.module.css";
import { useContext } from "react";
import { LangContext } from "../context/LangContext";
export default function Rest({ children }) {
  const { language } = useContext(LangContext);

  return (
    <div
      className={`${styles.rest} ${language === "en-US" ? styles.restLtr : ""}`}
    >
      {children}
    </div>
  );
}
