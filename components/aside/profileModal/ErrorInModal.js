import GoBackButton from "../../GoBackButton";
import Modal from "../../Modal";
import styles from "./ErrorInModal.module.css";

export default function ErrorInMenu({ text, goBack }) {
  return (
    <Modal>
      <GoBackButton callback={goBack} />
      <p className={styles.p}>{text}</p>
    </Modal>
  );
}
