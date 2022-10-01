import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styles from "./GoBackButton.module.css";
import GoBackIcon from "./icons/GoBackIcon";

export default function GoBackButton({ callback }) {
  const { t } = useTranslation("menu");
  const { locale } = useRouter();
  return (
    <button
      title={t("actions.back")}
      className={`${styles.btn} ${locale === "en" ? styles.btnLtr : ""}`}
      type='button'
      onClick={callback}
    >
      <GoBackIcon />
    </button>
  );
}
