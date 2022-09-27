import styles from "./Login.module.css";
import { emailError, passwordError } from "../../../util/validate";
import Input from "../../Input";
import { useTranslation } from "next-i18next";
export default function Login({
  handleInputChange,
  inputsData,
  handleLogin,
  goBack,
}) {
  const { t } = useTranslation("menu");
  return (
    <>
      <button onClick={goBack} type='button'>
        {t("actions.back")}
      </button>
      <form className={`form`}>
        <h2>{t("titles.login")}</h2>
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
        <button
          disabled={
            emailError(inputsData.email) || passwordError(inputsData.password)
          }
          onClick={handleLogin}
        >
          {t("actions.login")}
        </button>
      </form>
    </>
  );
}
