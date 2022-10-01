import styles from "./ProfileModal.module.css";
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

export default function ProfileModal() {
  // all this component does is checking what to show in the profile modal,
  // based on the status state and if the user is connected or not.

  const { t } = useTranslation("menu");
  const { user, setUser } = useContext(UserContext);

  const inputsDataDefault = {
    email: "",
    password: "",
    name: "",
  };
  const [inputsData, setInputsData] = useState(inputsDataDefault);
  const [status, setStatus] = useState(0); // 0 - default, waiting for email, 1 - error, 2 - user does exist, 3 - user doesn't exist, 4 - loading. the 'status' state is used if the redux 'user' state doesn't.

  const errorsText = {
    general: t("error-text.general"),
  };

  const [errorText, setErrorText] = useState(errorsText.general);

  function defaultState() {
    setInputsData(inputsDataDefault);
    setStatus(0);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setInputsData(prev => ({ ...prev, [name]: value }));
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

  if (user) return <UserConnectedModal logOut={logOut} />;

  return (
    <Modal>
      {status === 0 && (
        <EmailForm
          setStatus={setStatus}
          errorsText={errorsText}
          setErrorText={setErrorText}
          inputsData={inputsData}
          handleInputChange={handleInputChange}
        />
      )}
      {status === 1 && <ErrorInMenu goBack={goBack} text={errorText} />}
      {status === 2 && (
        <Login
          handleInputChange={handleInputChange}
          inputsData={inputsData}
          defaultState={defaultState}
          setStatus={setStatus}
          setErrorText={setErrorText}
          goBack={goBack}
        />
      )}
      {status === 3 && (
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
      )}
      {status === 4 && (
        <div className={styles.loadingContainer}>
          <Loading width='40px' height='40px' padding='0' />
        </div>
      )}
    </Modal>
  );
}
