import styles from "./Header.module.css";
import MenuIcon from "./MenuIcon";
import SearchIcon from "./SearchIcon";
import NotificationsIcon from "./NotificationsIcon";
import ProfileIcon from "./ProfileIcon";
import Link from "next/link";
export default function Header({
  menuOnClickHandler,
  isOpen,
  modalOpen,
  setModalOpen,
}) {
  return (
    <header className={styles.header}>
      <div className={styles.right}>
        <MenuIcon menuOnClickHandler={menuOnClickHandler} isOpen={isOpen} />
        <Link href='/'>
          <a className={styles.link}>
            <h1 className={styles.logo}>REDILET</h1>
          </a>
        </Link>
      </div>

      <div className={styles.left}>
        <ProfileIcon
          isOpen={modalOpen === 0}
          onClick={() => setModalOpen(e => (e === 0 ? -1 : 0))}
        />
        <NotificationsIcon
          isOpen={modalOpen === 1}
          onClick={() => setModalOpen(e => (e === 1 ? -1 : 1))}
        />
        <SearchIcon
          isOpen={modalOpen === 2}
          onClick={() => setModalOpen(e => (e === 2 ? -1 : 2))}
        />
      </div>
    </header>
  );
}
