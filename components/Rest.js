import styles from "./Rest.module.css";
import { useTranslation } from "next-i18next";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
export default function Rest({ children }) {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState("");

  useEffect(() => {
    setLang(getCookie("lang"));
  }, []);

  return (
    <div className={`${styles.rest} ${lang === "en-US" ? styles.restLtr : ""}`}>
      {children}
    </div>
  );
}
