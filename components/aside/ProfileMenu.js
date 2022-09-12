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

export default function ProfileMenu() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  const inputsDataDefault = {
    email: "",
    password: "",
    name: "",
  };
  const [inputsData, setInputsData] = useState(inputsDataDefault);
  const [status, setStatus] = useState(0); // 0 - waiting for email, 1 - error, 2 - user does exist, 3 - user doesn't exist, 4 - loading. the 'status' state is used if the redux 'user' state doesn't.

  const errorsText = {
    wrongPassword: "סיסמה שגויה, נסה שוב",
    general: "שגיאה התרחשה, נסה שוב מאוחר יותר",
  };

  const [errorText, setErrorText] = useState(errorsText.general);

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

      // localStorage.setItem("name", data.name);
      // localStorage.setItem("loggedInUntil", data.loggedInUntil);
      setUser(JSON.parse(userCookie));
    } catch (err) {
      // if (err.response) {
      //   // The request was made and the server responded with a status code
      //   // that falls out of the range of 2xx
      //   console.log("error.response.data", err.response.data);
      //   console.log("error.response.status", err.response.status);
      //   console.log("error.response.headers", err.response.headers);
      // } else if (err.request) {
      //   // The request was made but no response was received
      //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      //   // http.ClientRequest in node.js
      //   console.log("error.request", err.request);
      // } else {
      //   // Something happened in setting up the request that triggered an Error
      //   console.log("Error", err.message);
      //   setStatus(1);
      // }
      // console.log(err);
      setErrorText(errorsText.general);
      setStatus(1);
      // console.log("error: ", err?.response?.data);
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setInputsData(prev => ({ ...prev, [name]: value }));
  }

  async function logOut() {
    setStatus(4);
    setUser(null);
    try {
      await axios.delete("/api/logout");
    } catch (err) {
      console.log(err);
    }
    setInputsData(inputsDataDefault);
    setStatus(0);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setStatus(4);
    try {
      await axios.post("/api/login", {
        email: inputsData.email,
        password: inputsData.password,
      });
      const userCookie = getCookie("user");
      setUser(JSON.parse(userCookie));
    } catch (err) {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.data.error === "wrong password")
          setErrorText(errorsText.wrongPassword);

        // console.log("error.response.data", err.response.data);
        // console.log("error.response.status", err.response.status);
        // console.log("error.response.headers", err.response.headers);
      } else if (err.request) {
        setErrorText(errorsText.general);
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // console.log("error.request", err.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", err.message);
        setErrorText(errorsText.general);
      }
      setStatus(1);
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

        <Link href={router.asPath} locale={"he-IL"}>
          Hebrew
        </Link>
        <Link href={router.asPath} locale={"en-US"}>
          English
        </Link>
        <br />
        {user.isAdmin && <Link href={"/admin"}>Admin Page</Link>}
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
