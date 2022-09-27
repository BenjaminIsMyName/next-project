import styles from "./Icons.module.css";

export default function NotificationsIcon({ isOpen, onClick }) {
  function handleClick(e) {
    e.stopPropagation(); // stop propagation, don't call the other onClick event listener (the one that closes the menu when clicking somewhere)
    onClick(); // set littleMenuOpen to -1 (close it) if it's 1 (if this menu is open), otherwise 1 (open it)
  }
  return (
    <button
      type='button'
      aria-label={"התראות"}
      onClick={handleClick}
      className={`${isOpen ? styles.open : ""} ${styles.icon}`}
    >
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
        <path
          d='M102.3,204.6c0-65.5,41.4-123.8,103.2-145.3c-4.5-27.9,14.6-54.2,42.5-58.7s54.2,14.6,58.7,42.5c0.9,5.4,0.9,10.8,0,16.1
           c61.7,21.6,103,79.9,103,145.3v153.7l76.9,51.2v25.6H25.4v-25.6l76.9-51.2V204.6z M307.2,460.8c0,28.3-22.9,51.2-51.2,51.2
           s-51.2-22.9-51.2-51.2H307.2z'
        />
      </svg>
    </button>
  );
}
