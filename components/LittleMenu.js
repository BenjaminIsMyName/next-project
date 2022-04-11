import styles from "./LittleMenu.module.css";
export default function LittleMenu({ children }) {
  return <div className={styles.container}>{children}</div>;
}
