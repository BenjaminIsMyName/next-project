import Loading from "./Loading";
import Modal from "./Modal";

export default function LoadingModal() {
  return (
    <Modal>
      <div className={`h-10 overflow-hidden`}>
        <Loading width="40px" height="40px" padding="0" />
      </div>
    </Modal>
  );
}
