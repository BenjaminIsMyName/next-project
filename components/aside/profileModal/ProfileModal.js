import Modal from "../../Modal";
import { useState, useContext } from "react";
import Loading from "../../Loading";
import Signup from "./SignupForm";
import Login from "./LoginForm";
import EmailForm from "./EmailForm";
import { useRouter } from "next/router";
import { UserContext } from "../../../context/UserContext";
import useLogout from "../../../hooks/useLogout";
import { useTranslation } from "next-i18next";
import ErrorInMenu from "./ErrorInModal";
import UserConnectedModal from "./UserConnectedModal";
import useFormData from "../../../hooks/useFormData";
import LoadingModal from "../../LoadingModal";

export default function ProfileModal({ closeModals }) {
  // all this component does is checking what to show in the profile modal,
  // based on the status state and if the user is connected or not.

  const { t } = useTranslation("menu");
  const { user, setUser } = useContext(UserContext);

  const inputsDataDefault = {
    email: "",
    password: "",
    name: "",
  };
  const { inputsData, setInputsData, handleInputChange } =
    useFormData(inputsDataDefault);
  const [status, setStatus] = useState(0); // 0 - default, waiting for email, 1 - error, 2 - user does exist, 3 - user doesn't exist, 4 - loading. the 'status' state is used if the redux 'user' state doesn't.

  const errorsText = {
    general: t("error-text.general"),
  };

  const [errorText, setErrorText] = useState(errorsText.general);

  function defaultState() {
    setInputsData(inputsDataDefault);
    setStatus(0);
  }

  const logoutFunc = useLogout();

  async function logOut() {
    setStatus(4);
    setUser(null);
    await logoutFunc();
    setInputsData(inputsDataDefault);
    setStatus(0);
  }

  // this function is used to go back from login/signup to the email form
  function goBack() {
    setStatus(0);
    setInputsData(prev => ({ ...inputsDataDefault, email: prev.email })); // clear all data except email
  }

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
