import styles from "./Options.module.css";
import ForYouIcon from "./ForYouIcon.js";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Option({ selected, text, link }) {
  const { locale } = useRouter();

  return (
    <Link href={link}>
      <a
        className={`${styles.option} ${
          locale === "en" ? styles.optionLtr : ""
        }`}
        id={selected ? styles.selected : ""}
      >
        <ForYouIcon selected={selected} />
        <span>{text}</span>
      </a>
    </Link>
  );
}
