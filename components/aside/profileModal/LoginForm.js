import styles from "./LoginForm.module.css";
import { emailError, passwordError } from "../../../util/validate";
import Input from "../../Input";
import { useTranslation } from "next-i18next";
import GoBackButton from "../../GoBackButton";
import useLogin from "../../../hooks/useLogin";
import Button from "../../Button";
import Modal from "../../Modal";
export default function Login({
  handleInputChange,
  inputsData,
  goBack,
  setStatus,
  defaultState,
  setErrorText,
}) {
  const { t } = useTranslation("menu");
  const loginFunc = useLogin();

  async function handleLogin(e) {
    e.preventDefault();
    setStatus(4);
    const { errorTextPassword, success } = await loginFunc(
      inputsData.email,
      inputsData.password
    );
    if (success) {
      defaultState();
    } else {
      setStatus(1);
      console.log(errorTextPassword);
      setErrorText(errorTextPassword);
    }
  }
  return (
    <Modal>
      <form className={`form`}>
        <GoBackButton callback={goBack} />
        <h2>{t("titles.login")}</h2>
        <Input
          checkErrorCallback={emailError}
          valueObj={inputsData}
          onChange={handleInputChange}
          type="email"
          name="email"
          placeholder={t("inputs.email")}
          disabled={true}
        />
        <Input
          checkErrorCallback={passwordError}
          valueObj={inputsData}
          onChange={handleInputChange}
          type="password"
          name="password"
          placeholder={t("inputs.password")}
        />
        <Button
          disabled={
            emailError(inputsData.email) || passwordError(inputsData.password)
          }
          onClick={handleLogin}
        >
          {t("actions.login")}
        </Button>
      </form>
    </Modal>
  );
}
