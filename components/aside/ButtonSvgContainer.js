import styles from "./ButtonSvgContainer.module.css";

export default function ButtonSvgContainer({
  ariaLabel,
  children,
  isOpen,
  onClick,
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`${isOpen ? styles.open : ""} ${styles.icon}`}
    >
      {children}
    </button>
  );
}
