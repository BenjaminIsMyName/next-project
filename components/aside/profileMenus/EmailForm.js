import styles from "./EmailForm.module.css";
import { emailError } from "../../../util/validate";
import Input from "../../Input";
import { useTranslation } from "next-i18next";

export default function EmailForm({
  handleInputChange,
  inputsData,
  handleEmailSubmit,
}) {
  const { t } = useTranslation("menu");
  return (
    <form className='form'>
      <h2>{t("titles.login-or-signup")}</h2>
      <Input
        checkErrorCallback={emailError}
        valueObj={inputsData}
        onChange={handleInputChange}
        type='email'
        name='email'
        placeholder={t("inputs.email")}
      />

      <button
        disabled={emailError(inputsData.email)}
        onClick={handleEmailSubmit}
      >
        {t("actions.continue")}
      </button>
    </form>
  );
}
