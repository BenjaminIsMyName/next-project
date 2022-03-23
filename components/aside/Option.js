import styles from "./Options.module.css";
import ForYouIcon from "./ForYouIcon.js";

export default function Option({ selected, text, link }) {
  return (
    <a
      href={link}
      className={styles.option}
      id={selected ? styles.selected : ""}
    >
      <ForYouIcon selected={selected} />
      <span>{text}</span>
    </a>
  );
}
