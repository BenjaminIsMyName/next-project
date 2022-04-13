import styles from "./LittleMenu.module.css";
export default function LittleMenu({ children, isBigMenuOpen }) {
  return (
    <div
      className={`${styles.container} ${isBigMenuOpen ? styles.opened : ""}`}
    >
      {children}
    </div>
  );
}
