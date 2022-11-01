import Input from "../../Input";
import Modal from "../../Modal";
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
        <h2>{t("titles.edit")}</h2>
        <Input
          checkErrorCallback={emailError}
          valueObj={inputsData}
          onChange={handleInputChange}
          type="email"
          name="email"
          placeholder={t("inputs.email")}
        />
        <Input
          checkErrorCallback={passwordError}
          valueObj={inputsData}
          onChange={handleInputChange}
          type="password"
          name="password"
          placeholder={t("inputs.password")}
        />

        <Input
          checkErrorCallback={nameError}
          valueObj={inputsData}
          onChange={handleInputChange}
          type="text"
          name="name"
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
          {t("actions.save").toUpperCase()}
        </Button>
        <Button
          type="button"
          className={`shadow-none rounded-none text-sm [&_span]:text-error-color border-2 border-solid border-error-color`}
          onClick={handleDelete}
        >
          {t("actions.delete-account").toUpperCase()}
        </Button>
        <Button
          type="button"
          className={`shadow-none rounded-none [&_span]:text-error-color text-xl border-2 border-solid border-error-color`}
          onClick={goBack}
        >
          {t("actions.cancel").toUpperCase()}
        </Button>
      </form>
    </Modal>
  );
}
