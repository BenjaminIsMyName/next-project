import Input from "../../Input";
import Modal from "../../Modal";
import styles from "./EditProfileModal.module.css";
import { emailError, passwordError, nameError } from "../../../util/validate";
import Button from "../../Button";
import { useTranslation } from "next-i18next";
export default function EditProfileModal({
  inputsData,
  handleInputChange,
  goBack,
  handleDelete,
  handleEdit,
}) {
  const { t } = useTranslation("menu");
  return (
    <Modal>
      <form className={`form`}>
        <h2>Edit Your Profile</h2>
        <Input
          checkErrorCallback={emailError}
          valueObj={inputsData}
          onChange={handleInputChange}
          type='email'
          name='email'
          placeholder={t("inputs.email")}
        />
        <Input
          checkErrorCallback={passwordError}
          valueObj={inputsData}
          onChange={handleInputChange}
          type='password'
          name='password'
          placeholder={t("inputs.password")}
        />

        <Input
          checkErrorCallback={nameError}
          valueObj={inputsData}
          onChange={handleInputChange}
          type='text'
          name='name'
          placeholder={t("inputs.name")}
        />
        <Button
          disabled={
            emailError(inputsData.email) ||
            passwordError(inputsData.password) ||
            nameError(inputsData.name)
          }
          onClick={e => {
            e.preventDefault();
            handleEdit();
          }}
        >
          SAVE
        </Button>
        <Button
          type='button'
          className={styles.deleteAccount}
          onClick={handleDelete}
        >
          DELETE ACCOUNT
        </Button>
        <Button type='button' className={styles.cancel} onClick={goBack}>
          CANCEL
        </Button>
      </form>
    </Modal>
  );
}
