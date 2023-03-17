import { emailError } from "../../../util/validate";
import Input from "../../Input";
import { useTranslation } from "next-i18next";
import axios from "axios";
import Button from "../../Button";
import Modal from "../../Modal";
import Balancer from "react-wrap-balancer";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { GoogleContext } from "../../../context/GoogleContext";
import { getCookie } from "cookies-next";

export default function EmailForm({
  handleInputChange,
  inputsData,
  setStatus,
  setErrorText,
  errorsText,
  setUser,
  defaultState,
}) {
  const { t } = useTranslation("menu");
  const { locale } = useRouter();

  useEffect(() => {
    google.accounts.id.renderButton(
      document.getElementById("googleContainer"),
      {
        theme: "outline",
        size: "small",
        text: "continue_with",
        locale: locale === "en" ? "en_US" : "he_IL",
        theme: "filled_black",
      } // customization attributes
    );
  }, [locale]);

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setStatus(4);
    try {
      const { data } = await axios.get("/api/user", {
        params: {
          email: inputsData.email,
        },
      });

      if (data.withGoogle) {
        setErrorText(errorsText.tryWithGoogle);
        setStatus(1);
        return;
      }

      if (data.exists) setStatus(2);
      else setStatus(3);
    } catch (err) {
      setErrorText(errorsText.general);
      setStatus(1);
    }
  }

  // Tell the function in the useGoogle hook to call the handleGoogleLoginHere function.
  const { callCallback } = useContext(GoogleContext);
  callCallback(handleGoogleLoginHere);
  async function handleGoogleLoginHere(response) {
    setStatus(4);
    try {
      await axios.post("/api/signup", {
        googleToken: response,
      });
      const userCookie = getCookie("user");
      setUser(JSON.parse(userCookie));
      defaultState();
    } catch (err) {
      console.log("error in EmailForm.js component", err);
      if (err.response.status === 409) {
        setErrorText(errorsText.tryWithPassword);
      } else {
        setErrorText(errorsText.general);
      }

      setStatus(1);
    }
  }

  return (
    <Modal>
      <div
        id="googleContainer"
        className="mb-2 h-[44px] overflow-hidden animate-show opacity-0"
      ></div>
      <form className="form">
        <Balancer>
          <h2 className={`text-[23px] font-another-font-family`}>
            {t("titles.login-or-signup")}
          </h2>
        </Balancer>
        <Input
          checkErrorCallback={emailError}
          valueObj={inputsData}
          onChange={handleInputChange}
          type="email"
          name="email"
          placeholder={t("inputs.email")}
        />

        <Button
          disabled={emailError(inputsData.email)}
          onClick={handleEmailSubmit}
        >
          {t("actions.continue")}
        </Button>
      </form>
    </Modal>
  );
}
