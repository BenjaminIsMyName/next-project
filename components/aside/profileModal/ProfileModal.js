import { useState, useContext, useEffect, useCallback } from "react";
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
  const [status, setStatus] = useState(0); // 0 - default, waiting for email, 1 - error, 2 - user does exist, 3 - user doesn't exist, 4 - loading. the 'status' state is used if the redux 'user' state doesn't.

  const { errorsText } = useContext(GoogleContext);

  const [errorText, setErrorText] = useState(errorsText.general);

  const defaultState = useCallback(() => {
    setInputsData(inputsDataDefault);
    setStatus(0);
  }, [setInputsData, setStatus]); // same as [] because none of the values change

  const logoutFunc = useLogout();

  async function logOut() {
    setStatus(4);
    const id = add({ title: t("alerts.logging-out") });
    await logoutFunc();
    setUser(null);
    setInputsData(inputsDataDefault);
    setStatus(0);
    remove(id);
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
  } = useContext(GoogleContext);

  useEffect(() => {
    // if (googleLoginMethod !== GoogleLoginMethodsEnum.button) {
    //   return;
    // }
    if (googleStatus === GoogleStatusEnum.loading) {
      setStatus(4);
    } else if (googleStatus === GoogleStatusEnum.error) {
      setStatus(1);
      if (googleError.statusCode === 409) {
        setErrorText(errorsText.tryWithPassword);
      } else {
        setErrorText(errorsText.general);
      }
    } else if (googleStatus === GoogleStatusEnum.success) {
      setInputsData(inputsDataDefault);
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
    setErrorText,
    setInputsData,
    setStatus,
  ]); // same as [googleError.statusCode, googleStatus, googleLoginMethod] because none of the other values change

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
        setUser={setUser}
        defaultState={defaultState}
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
