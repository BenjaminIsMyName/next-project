import styles from "./Icons.module.css";

export default function SearchIcon({ onClick, isOpen }) {
  function handleClick(e) {
    e.stopPropagation();
    onClick(); // set littleMenuOpen to -1 (close it) if it's 2 (if this menu is open), otherwise 2 (open it)
  }
  return (
    <button
      aria-label={"חיפוש"}
      onClick={handleClick}
      className={`${isOpen ? styles.open : ""} ${styles.icon}`}
    >
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 21 21'>
        <g transform='translate(-535 -338)'>
          <rect
            id='Rectangle_6'
            data-name='Rectangle 6'
            fill='none'
            width='21'
            height='21'
            transform='translate(535 338)'
          />
          <path
            id='search_copy'
            data-name='search copy'
            fill='fill: #1d1d1d'
            d='M19.3,18.3h0l-4.7-4.9A8.31,8.31,0,0,0,13.5,1.9a8.327,8.327,0,0,0-11.6,1,8.243,8.243,0,0,0,1,11.6,8.593,8.593,0,0,0,5.3,1.9h0A8.555,8.555,0,0,0,12.8,15l4.7,4.9a1.234,1.234,0,0,0,.8.4h.1a1.136,1.136,0,0,0,.8-.3,1.234,1.234,0,0,0,.4-.8A.855.855,0,0,0,19.3,18.3ZM8.2,14A5.8,5.8,0,1,1,14,8.2,5.8,5.8,0,0,1,8.2,14Z'
            transform='translate(535.629 338.496)'
          />
        </g>
      </svg>
    </button>
  );
}
