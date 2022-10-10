import Loading from "./Loading";
import styles from "./LoadingModal.module.css";
import Modal from "./Modal";

export default function LoadingModal() {
  return (
    <Modal>
      <div className={styles.loadingContainer}>
        <Loading width='40px' height='40px' padding='0' />
      </div>
    </Modal>
  );
}
