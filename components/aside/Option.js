import styles from "./Options.module.css";
import ForYouIcon from "./ForYouIcon.js";
import { useTranslation } from "next-i18next";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
export default function Option({ selected, text, link }) {
  const { i18n } = useTranslation();

  const [lang, setLang] = useState("");

  useEffect(() => {
    setLang(getCookie("lang"));
  }, []);
  return (
    <a
      href={link}
      className={`${styles.option} ${lang === "en-US" ? styles.optionLtr : ""}`}
      id={selected ? styles.selected : ""}
    >
      <ForYouIcon selected={selected} />
      <span>{text}</span>
    </a>
  );
}
