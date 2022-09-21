import styles from "./ProfileMenu.module.css";
import LittleMenu from "../LittleMenu";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import Loading from "../Loading";
import { getCookie } from "cookies-next";
import Signup from "./Signup";
import Login from "./Login";
import EmailForm from "./EmailForm";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserContext } from "../../context/UserContext";
import useLogout from "../../hooks/useLogout";
import useLogin from "../../hooks/useLogin";
import { useTranslation } from "next-i18next";
export default function ProfileMenu() {
  const { t } = useTranslation("menu");
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

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

  console.log(errorsText);

  const [errorText, setErrorText] = useState(errorsText.general);

  function defaultState() {
    setInputsData(inputsDataDefault);
    setStatus(0);
  }

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

  async function handleRegisteration(e) {
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
    } catch (err) {
      setErrorText(errorsText.general);
      setStatus(1);
    }
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

  // this function is used to go back from login/signup to the email form
  function goBack() {
    setStatus(0);
    setInputsData(prev => ({ ...inputsDataDefault, email: prev.email })); // clear all data except email
  }

  if (user)
    return (
      <LittleMenu>
        <p>Welcome, {user.name}</p>
        <button onClick={logOut}>התנתק</button>

        <Link href={router.asPath} locale={"he"}>
          <a> Hebrew</a>
        </Link>
        <Link href={router.asPath} locale={"en"}>
          <a>English</a>
        </Link>
        <br />
        {user.isAdmin && (
          <Link href={"/admin"}>
            <a>Admin Page</a>
          </Link>
        )}
      </LittleMenu>
    );

  return (
    <LittleMenu>
      {status === 0 && (
        <EmailForm
          handleEmailSubmit={e => handleEmailSubmit(e)}
          inputsData={inputsData}
          handleInputChange={handleInputChange}
        />
      )}
      {status === 1 && <p> {errorText}</p>}
      {status === 2 && (
        <Login
          handleInputChange={handleInputChange}
          inputsData={inputsData}
          handleLogin={e => handleLogin(e)}
          goBack={goBack}
        />
      )}
      {status === 3 && (
        <Signup
          goBack={goBack}
          handleInputChange={handleInputChange}
          inputsData={inputsData}
          handleRegisteration={e => handleRegisteration(e)}
        />
      )}
      {status === 4 && <Loading width='30px' height='30px' padding='10px' />}
    </LittleMenu>
  );
}
