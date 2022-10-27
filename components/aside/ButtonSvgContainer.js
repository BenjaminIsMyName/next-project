import styles from "./ButtonSvgContainer.module.css";

export default function ButtonSvgContainer({
  ariaLabel,
  children,
  isOpen,
  onClick,
}) {
  function handleClick(e) {
    e.stopPropagation();
    onClick();
  }
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={handleClick}
      className={`${isOpen ? styles.open : ""} ${styles.icon}`}
    >
      {children}
    </button>
  );
}
