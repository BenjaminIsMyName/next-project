import { useTranslation } from "next-i18next";
import styles from "./GoBackButton.module.css";
import GoBackIcon from "./icons/GoBackIcon";

export default function GoBackButton({ callback }) {
  const { t } = useTranslation("menu");
  return (
    <button
      title={t("actions.back")}
      className={`${styles.btn}`}
      type='button'
      onClick={callback}
    >
      <GoBackIcon />
    </button>
  );
}
