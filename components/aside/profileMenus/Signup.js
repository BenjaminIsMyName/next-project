import styles from "./Signup.module.css";
import { emailError, passwordError, nameError } from "../../../util/validate";
import Input from "../../Input";
import { useTranslation } from "next-i18next";
export default function Signup({
  handleInputChange,
  inputsData,
  handleRegisteration,
  goBack,
}) {
  const { t } = useTranslation("menu");

  return (
    <>
      <button onClick={goBack}>{t("actions.back")}</button>
      <form className={`form`}>
        <h2>{t("titles.signup")}</h2>
        <Input
          checkErrorCallback={emailError}
          errorText={t("error-text.email-validation")}
          valueObj={inputsData}
          onChange={handleInputChange}
          type='email'
          name='email'
          placeholder={t("inputs.email")}
          disabled={true}
        />
        <Input
          checkErrorCallback={passwordError}
          errorText={t("error-text.password-validation")}
          valueObj={inputsData}
          onChange={handleInputChange}
          type='password'
          name='password'
          placeholder={t("inputs.password")}
        />

        <Input
          checkErrorCallback={nameError}
          errorText={t("error-text.name-validation")}
          valueObj={inputsData}
          onChange={handleInputChange}
          type='text'
          name='name'
          placeholder={t("inputs.name")}
        />
        <button
          disabled={
            emailError(inputsData.email) ||
            passwordError(inputsData.password) ||
            nameError(inputsData.name)
          }
          onClick={handleRegisteration}
        >
          {t("actions.signup")}
        </button>
      </form>
    </>
  );
}
