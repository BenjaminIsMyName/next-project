import styles from "./Header.module.css";
import MenuIcon from "./MenuIcon";
import SearchIcon from "./SearchIcon";
import NotificationsIcon from "./NotificationsIcon";
import ProfileIcon from "./ProfileIcon";
export default function Header({
  menuOnClickHandler,
  isOpen,
  littleMenuOpen,
  setLittleMenuOpen,
}) {
  return (
    <header className={styles.header}>
      <div className={styles.right}>
        <MenuIcon menuOnClickHandler={menuOnClickHandler} isOpen={isOpen} />
        <h1 className={styles.logo}>REDILET</h1>
      </div>

      <div className={styles.left}>
        <ProfileIcon
          isOpen={littleMenuOpen === 0}
          onClick={() => setLittleMenuOpen(e => (e === 0 ? -1 : 0))}
        />
        <NotificationsIcon
          isOpen={littleMenuOpen === 1}
          onClick={() => setLittleMenuOpen(e => (e === 1 ? -1 : 1))}
        />
        <SearchIcon
          isOpen={littleMenuOpen === 2}
          onClick={() => setLittleMenuOpen(e => (e === 2 ? -1 : 2))}
        />
      </div>
    </header>
  );
}
