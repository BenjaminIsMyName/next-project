import styles from "./LittleMenu.module.css";
import { useContext } from "react";
import { LangContext } from "../context/LangContext";
export default function LittleMenu({ children }) {
  const { language } = useContext(LangContext);

  return (
    <div
      className={`${styles.container} ${
        language === "en-US" ? styles.containerLtr : ""
      }`}
    >
      {children}
    </div>
  );
}
