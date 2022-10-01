import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import Modal from "../../Modal";
import ThemesSection from "./ThemesSection";
import styles from "./UserConnectedModal.module.css";

export default function UserConnectedModal({ logOut }) {
  const { t } = useTranslation("menu");
  const router = useRouter();
  const { locale } = router;
  const { user } = useContext(UserContext);
  return (
    <Modal>
      <p className={styles.welcome}>
        {t("titles.welcome")}, {user.name}
      </p>
      <button onClick={logOut} className={styles.logoutButton} type='button'>
        {t("actions.logout")}
      </button>
      <div className={styles.langContainer}>
        <Link href={router.asPath} locale={"he"}>
          <a className={`${locale === "he" ? styles.selected : ""}`}>עברית</a>
        </Link>
        <Link href={router.asPath} locale={"en"}>
          <a className={`${locale === "en" ? styles.selected : ""}`}>English</a>
        </Link>
      </div>

      {user.isAdmin && (
        <Link href={"/admin"}>
          <a
            style={{
              display: "block",
              textDecoration: "none",
              color: "rgb(var(--option-text-color))",
              textAlign: "center",
              padding: "40px",
              backgroundColor: "rgba(var(--third-color), 0.3)",
              marginTop: "15px",
            }}
          >
            {t("admin-page")}
          </a>
        </Link>
      )}

      <strong className={styles.themesTitle}>{t("titles.themes")}:</strong>
      <ThemesSection />
    </Modal>
  );
}
