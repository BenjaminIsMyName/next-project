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
}) {
  const loaded = useLoaded();
  const { user } = useContext(UserContext);
  const { t } = useTranslation("common");
  return (
    <header className={styles.header}>
      <div className={styles.right}>
        <MenuIcon menuOnClickHandler={menuOnClickHandler} isOpen={isOpen} />
        <Link href="/" scroll={false}>
          <a className={styles.link}>
            <h1 className={styles.logo}>REDILET</h1>
          </a>
        </Link>
      </div>

      <div className={styles.left}>
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
