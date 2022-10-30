import styles from "./Options.module.css";
import ForYouIcon from "./ForYouIcon.js";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Option({ text, link }) {
  const router = useRouter();
  const locale = router.locale;
  return (
    <Link href={link}>
      <a
        className={`${styles.option} ${
          locale === "en" ? styles.optionLtr : ""
        }`}
        id={router.route === link ? styles.selected : ""}
      >
        <ForYouIcon selected={router.route === link} />
        <span>{text}</span>
      </a>
    </Link>
  );
}
