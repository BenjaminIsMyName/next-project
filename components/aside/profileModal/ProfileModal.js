import { useState, useContext, useEffect, useCallback, useRef } from "react";
import Signup from "./SignupForm";
import Login from "./LoginForm";
import EmailForm from "./EmailForm";
import { UserContext } from "../../../context/UserContext";
import useLogout from "../../../hooks/useLogout";
import { useTranslation } from "next-i18next";
import ErrorInMenu from "./ErrorInModal";
import UserConnectedModal from "./UserConnectedModal";
import useFormData from "../../../hooks/useFormData";
import LoadingModal from "../../LoadingModal";
import { AlertContext } from "../../../context/AlertContext";
import { GoogleContext } from "../../../context/GoogleContext";
import { ConfettiContext } from "@context/ConfettiContext";

const inputsDataDefault = {
  email: "",
  password: "",
  name: "",
};

export default function ProfileModal({ closeModals }) {
  // all this component does is checking what to show in the profile modal,
  // based on the status state and if the user is connected or not.

  const { t } = useTranslation("menu");
  const { user, setUser } = useContext(UserContext);
  const { add, remove } = useContext(AlertContext);

  const { inputsData, setInputsData, handleInputChange } =
    useFormData(inputsDataDefault);
  const [status, setStatus] = useState(0); // 0 - default, waiting for email, 1 - error, 2 - user does exist, 3 - user doesn't exist, 4 - loading.
  // TODO: change the numbers to enum, like in many other places across the project. Much more readable and maintainable.

  const { errorsText } = useContext(GoogleContext);

  const [errorText, setErrorText] = useState(errorsText.general);

  const defaultState = useCallback(() => {
    setInputsData(inputsDataDefault);
    setStatus(0);
  }, [setInputsData, setStatus]); // same as [] because none of the values change

  const logoutFunc = useLogout();

  async function logOut() {
    setStatus(4);
    /*

     it's possible to remove the alert by doing: 
     const id = add({ ... }); 
     ........
     remove(id); 
     
     the remove function is in the AlertContext.
     but I decided to not remove it, because if the log out was done very quickly, 
     the user will see the alert for a very short time, which might be confusing and look like a bug.

    */
    add({ title: t("alerts.logging-out") });
    await logoutFunc();
    setUser(null);
    setInputsData(inputsDataDefault);
    setStatus(0);
    add({ title: t("alerts.logged-out"), color: "success" });
  }

  // this function is used to go back from login/signup to the email form
  function goBack() {
    setStatus(0);
    setInputsData(prev => ({ ...inputsDataDefault, email: prev.email })); // clear all data except email
  }

  const {
    googleStatus,
    googleError,
    GoogleStatusEnum,
    googleLoginMethod,
    GoogleLoginMethodsEnum,
    loginOrSignup,
  } = useContext(GoogleContext);

  const { playConfetti } = useContext(ConfettiContext);

  // to show error only when state changes, and not on mount
  const renderCount = useRef(0);
  useEffect(() => {
    // if (googleLoginMethod !== GoogleLoginMethodsEnum.button) {
    //   return;
    // }

    // don't show error on initial modal mount, only when it's already opened and something goes wrong!
    const rendersOnMount = process.env.NODE_ENV === "production" ? 1 : 2; // with strict mode it's 2 times
    renderCount.current++;

    if (googleStatus === GoogleStatusEnum.loading) {
      setStatus(4);
    } else if (
      googleStatus === GoogleStatusEnum.error &&
      renderCount.current > rendersOnMount // see above comment(s), this is to prevent showing error on initial modal mount
    ) {
      setStatus(1);
      if (googleError.statusCode === 409) {
        setErrorText(errorsText.tryWithPassword);
      } else {
        setErrorText(errorsText.general);
      }
    } else if (googleStatus === GoogleStatusEnum.success) {
      if (loginOrSignup === "signup") {
        playConfetti();
      }
      defaultState(); // reset the state, so when deleting account or something - it will show the (empty) email form again. even if the modal was never closed...
    }
  }, [
    GoogleLoginMethodsEnum.button,
    GoogleStatusEnum.error,
    GoogleStatusEnum.loading,
    GoogleStatusEnum.success,
    defaultState,
    errorsText.general,
    errorsText.tryWithPassword,
    googleError.statusCode,
    googleLoginMethod,
    googleStatus,
    loginOrSignup,
    playConfetti,
    setErrorText,
    setInputsData,
    setStatus,
  ]); // same as [googleError.statusCode, googleStatus, googleLoginMethod, loginOrSignup] because none of the other values change

  if (user)
    return <UserConnectedModal logOut={logOut} closeModals={closeModals} />;
  if (status === 4) return <LoadingModal />;
  if (status === 0)
    return (
      <EmailForm
        setStatus={setStatus}
        errorsText={errorsText}
        setErrorText={setErrorText}
        inputsData={inputsData}
        handleInputChange={handleInputChange}
      />
    );
  if (status === 1) return <ErrorInMenu goBack={goBack} text={errorText} />;
  if (status === 2)
    return (
      <Login
        handleInputChange={handleInputChange}
        inputsData={inputsData}
        defaultState={defaultState}
        setStatus={setStatus}
        setErrorText={setErrorText}
        goBack={goBack}
      />
    );
  if (status === 3)
    return (
      <Signup
        goBack={goBack}
        handleInputChange={handleInputChange}
        inputsData={inputsData}
        setErrorText={setErrorText}
        setStatus={setStatus}
        setUser={setUser}
        defaultState={defaultState}
        errorsText={errorsText}
      />
    );
}
