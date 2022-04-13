import styles from "./MenuIcon.module.css";
import iconsStyles from "./Icons.module.css";
export default function MenuIcon({ menuOnClickHandler, isOpen }) {
  return (
    <button
      onClick={menuOnClickHandler}
      className={`${isOpen ? styles.opened : ""} ${iconsStyles.icon}`}
    >
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
        <g>
          <path
            d='M83.8 31.2H16.2c-3.5 0-6.2-2.8-6.2-6.2s2.8-6.2 6.2-6.2h67.5c3.5 0 6.2 2.8 6.2 6.2s-2.7 6.2-6.1 6.2z'
            className={styles.firstPath}
          />
        </g>
        <g>
          <path
            d='M83.8 56.2H16.2c-3.5 0-6.2-2.8-6.2-6.2s2.8-6.2 6.2-6.2h67.5c3.5 0 6.2 2.8 6.2 6.2s-2.7 6.2-6.1 6.2z'
            className={styles.secondPath}
          />
        </g>
        <g>
          <path
            d='M83.8 81.2H16.2c-3.5 0-6.2-2.8-6.2-6.2s2.8-6.2 6.2-6.2h67.5c3.5 0 6.2 2.8 6.2 6.2s-2.7 6.2-6.1 6.2z'
            className={styles.thirdPath}
          />
        </g>
      </svg>
    </button>
  );
}
