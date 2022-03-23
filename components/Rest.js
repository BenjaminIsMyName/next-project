import styles from "./Rest.module.css";
export default function Rest({ children, blur, menuOnClickHandler }) {
  return (
    <div
      className={`${styles.rest} ${blur ? styles.blur : ""}`}
      onClick={blur ? () => menuOnClickHandler(null) : () => {}}
    >
      {children}
    </div>
  );
}
