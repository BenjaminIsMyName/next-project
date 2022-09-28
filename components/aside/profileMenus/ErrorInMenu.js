import GoBackButton from "../../GoBackButton";
import styles from "./ErrorInMenu.module.css";

export default function ErrorInMenu({ text, goBack }) {
  return (
    <div>
      <GoBackButton callback={goBack} />
      <p className={styles.p}>{text}</p>
    </div>
  );
}
