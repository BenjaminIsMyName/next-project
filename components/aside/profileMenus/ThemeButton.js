import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import styles from "./ThemeButton.module.css";

export default function ThemeButton({
  description,
  themeName,
  setSelected,
  selected,
}) {
  const { setTheme } = useContext(ThemeContext);
  return (
    <button
      type='button'
      title={description}
      aria-label={description}
      className={`${styles.themeButton} ${styles[themeName]} ${
        selected === themeName ? styles.selected : ""
      }`}
      onClick={() => {
        setTheme(themeName);
        setSelected(themeName);
      }}
    ></button>
  );
}
