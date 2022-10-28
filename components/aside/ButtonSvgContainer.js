import styles from "./ButtonSvgContainer.module.css";

export default function ButtonSvgContainer({
  ariaLabel,
  children,
  isOpen,
  onClick,
  applyPropagation,
}) {
  function handleClick(e) {
    if (!applyPropagation) {
      // this check is for the <MenuIcon/>.... We don't want to stopPropagation if it's the menu button...
      e.stopPropagation();
    }
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
