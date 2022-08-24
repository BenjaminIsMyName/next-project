import styles from "./LittleMenu.module.css";
import { useTranslation } from "next-i18next";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
export default function LittleMenu({ children }) {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState("");

  useEffect(() => {
    setLang(getCookie("lang"));
  }, []);

  return (
    <div
      className={`${styles.container} ${
        lang === "en-US" ? styles.containerLtr : ""
      }`}
    >
      {children}
    </div>
  );
}
