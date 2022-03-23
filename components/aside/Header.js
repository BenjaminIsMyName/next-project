import styles from "./Header.module.css";
import MenuIcon from "./MenuIcon";
import SearchIcon from "./SearchIcon";
import NotificationsIcon from "./NotificationsIcon";
import ProfileIcon from "./ProfileIcon";
export default function Header({ menuOnClickHandler, isOpen }) {
  return (
    <header className={styles.header}>
      <div className={styles.right}>
        <MenuIcon menuOnClickHandler={menuOnClickHandler} isOpen={isOpen} />
        <h1 className={styles.logo}>REDILET</h1>
      </div>

      <div className={styles.left}>
        <ProfileIcon />
        <NotificationsIcon />
        <SearchIcon />
      </div>
    </header>
  );
}
