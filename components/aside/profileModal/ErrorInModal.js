import GoBackButton from "../../GoBackButton";
import Modal from "../../Modal";

export default function ErrorInMenu({ text, goBack }) {
  return (
    <Modal>
      <GoBackButton callback={goBack} />
      <p className={`text-error-color mt-3`}>{text}</p>
    </Modal>
  );
}
