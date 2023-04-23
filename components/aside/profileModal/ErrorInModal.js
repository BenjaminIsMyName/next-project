import { useTranslation } from "next-i18next";
import GoBackButton from "../../GoBackButton";
import Modal from "../../Modal";

export default function ErrorInMenu({ text, goBack }) {
  const { t } = useTranslation("menu");
  return (
    <Modal>
      <GoBackButton callback={goBack} />
      <p className={`text-error-color mt-3`}>{t(text)}</p>
    </Modal>
  );
}
