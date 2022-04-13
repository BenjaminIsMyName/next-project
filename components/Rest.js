import styles from "./Rest.module.css";
export default function Rest({ children, blur, menuOnClickHandler, onClick }) {
  function handleClick() {
    onClick();
    if (blur) menuOnClickHandler(null);
  }
  return (
    <div
      className={`${styles.rest} ${blur ? styles.blur : ""}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
