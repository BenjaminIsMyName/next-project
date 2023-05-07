import styles from "./Header.module.css";
import MenuIcon from "./MenuIcon";
import ProfileIcon from "../icons/ProfileIcon";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import ButtonSvgContainer from "./ButtonSvgContainer";
import LoginIcon from "../icons/LoginIcon";
import { useTranslation } from "next-i18next";
import useLoaded from "../../hooks/useLoaded";

export default function Header({
  menuOnClickHandler,
  isOpen,
  modalOpen,
  setModalOpen,
  setIsOpen,
}) {
  const loaded = useLoaded();
  const { user } = useContext(UserContext);
  const { t } = useTranslation("common");
  return (
    <header className={styles.header}>
      <div className={styles.right}>
        <MenuIcon menuOnClickHandler={menuOnClickHandler} isOpen={isOpen} />
        <Link href="/" scroll={false}>
          <a className={styles.link} onClick={() => setIsOpen(false)}>
            <h1 className={styles.logo}>REDILET</h1>
          </a>
        </Link>
      </div>
      {/* every element that has the attribute data-should-not-close-little-or-big-menu - 
      a click on it (or it children) won't trigger the "I clicked outside" (in the Overlay/Aside) so I should close the stuff that are opened... */}
      <div className={styles.left} data-should-not-close-little-or-big-menu>
        <ButtonSvgContainer
          ariaLabel={t("account")}
          isOpen={modalOpen === 0}
          onClick={() => setModalOpen(e => (e === 0 ? -1 : 0))}
        >
          {loaded && user ? <ProfileIcon /> : <LoginIcon />}
        </ButtonSvgContainer>
      </div>
    </header>
  );
}
