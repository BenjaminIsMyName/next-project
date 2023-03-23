import styles from "./Options.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Option({ text, link, onClick, icon, newTab }) {
  const IconComponent = icon();
  const router = useRouter();
  const locale = router.locale;

  return (
    <Link href={link} scroll={false}>
      <a
        target={newTab ? "_blank" : "_self"}
        onClick={onClick}
        className={`${styles.option} ${
          locale === "en" ? styles.optionLtr : ""
        } ${router.route === link ? "[&_svg]:animate-go-in" : ""} `}
        id={router.route === link ? styles.selected : ""}
      >
        <IconComponent />
        <span>{text}</span>
      </a>
    </Link>
  );
}
