import styles from "./EmailForm.module.css";
import { emailError } from "../../../util/validate";
import Input from "../../Input";
import { useTranslation } from "next-i18next";
import axios from "axios";
import Button from "../../Button";
export default function EmailForm({
  handleInputChange,
  inputsData,
  setStatus,
  setErrorText,
  errorsText,
}) {
  const { t } = useTranslation("menu");

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setStatus(4);
    try {
      const { data } = await axios.get("/api/user", {
        params: {
          email: inputsData.email,
        },
      });
      if (data.exists) setStatus(2);
      else setStatus(3);
    } catch (err) {
      setErrorText(errorsText.general);
      setStatus(1);
    }
  }
  return (
    <form className='form'>
      <h2 className={styles.title}>{t("titles.login-or-signup")}</h2>
      <Input
        checkErrorCallback={emailError}
        valueObj={inputsData}
        onChange={handleInputChange}
        type='email'
        name='email'
        placeholder={t("inputs.email")}
      />

      <Button
        disabled={emailError(inputsData.email)}
        onClick={handleEmailSubmit}
      >
        {t("actions.continue")}
      </Button>
    </form>
  );
}
