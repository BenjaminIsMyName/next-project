import styles from "./Options.module.css";
import ForYouIcon from "./ForYouIcon.js";
import Link from "next/link";
import { useContext } from "react";
import { LangContext } from "../../context/LangContext";

export default function Option({ selected, text, link }) {
  const { language } = useContext(LangContext);

  return (
    <Link href='/'>
      <a
        href={link}
        className={`${styles.option} ${
          language === "en" ? styles.optionLtr : ""
        }`}
        id={selected ? styles.selected : ""}
      >
        <ForYouIcon selected={selected} />
        <span>{text}</span>
      </a>
    </Link>
  );
}
