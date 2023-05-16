import { emailError, passwordError, nameError } from "../../../util/validate";
import Input from "../../Input";
import { useTranslation } from "next-i18next";
import GoBackButton from "../../GoBackButton";
import { getCookie } from "cookies-next";
import axios from "axios";
import Button from "../../Button";
import Modal from "../../Modal";
import Balancer from "react-wrap-balancer";
import { useContext } from "react";
import { ConfettiContext } from "@context/ConfettiContext";

export default function Signup({
  handleInputChange,
  inputsData,
  setStatus,
  setUser,
  setErrorText,
  goBack,
  defaultState,
  errorsText,
}) {
  const { t } = useTranslation("menu");
  const { playConfetti } = useContext(ConfettiContext);

  async function handleRegistration(e) {
    e.preventDefault();
    setStatus(4);
    try {
      await axios.post("/api/signup", {
        email: inputsData.email,
        password: inputsData.password,
        name: inputsData.name,
      });
      const userCookie = getCookie("user");
      setUser(JSON.parse(userCookie));
      defaultState();
      playConfetti();
    } catch (err) {
      setErrorText(errorsText.general);
      setStatus(1);
    }
  }

  return (
    <Modal>
      <form className={`form`}>
        <GoBackButton callback={goBack} />
        <Balancer>
          <h2 className="text-[23px] font-another-font-family">
            {t("titles.signup")}
          </h2>
        </Balancer>
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
          onClick={handleRegistration}
        >
          {t("actions.signup")}
        </Button>
      </form>
    </Modal>
  );
}
