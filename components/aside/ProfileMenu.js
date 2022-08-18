import styles from "./ProfileMenu.module.css";
import LittleMenu from "../LittleMenu";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { emailError, nameError, passwordError } from "../../util/validate";
import Loading from "../Loading";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import { getCookie } from "cookies-next";
import Signup from "./Signup";
export default function ProfileMenu() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const inputsDataDefault = {
    email: "",
    password: "",
    name: "",
  };
  const [inputsData, setInputsData] = useState(inputsDataDefault);
  const [status, setStatus] = useState(0); // 0 - waiting for email, 1 - error while checking email, 2 - user does exist, 3 - user doesn't exist, 4 - loading, 5 - signned-up succesffuly
  // const sourceEmailCancelRef = useRef(axios.CancelToken.source());
  async function handleEmailSubmit() {
    setStatus(4);
    try {
      const { data } = await axios.get("/api/user", {
        params: {
          email: inputsData.email,
        },
        // cancelToken: sourceEmailCancelRef.current.token,
      });
      if (data.exists) setStatus(2);
      else setStatus(3);
    } catch (err) {
      setStatus(1);
      console.log("error: ", err?.response?.data);
    }
  }

  async function handleRegisteration() {
    setStatus(4);
    try {
      await axios.post("/api/signup", {
        email: inputsData.email,
        password: inputsData.password,
        name: inputsData.name,
        // cancelToken: sourceEmailCancelRef.current.token,
      });
      const userCookie = getCookie("user");

      // localStorage.setItem("name", data.name);
      // localStorage.setItem("loggedInUntil", data.loggedInUntil);
      dispatch(setUser(JSON.parse(userCookie)));
    } catch (err) {
      setStatus(1);
      console.log("error: ", err?.response?.data);
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setInputsData(prev => ({ ...prev, [name]: value }));
  }

  async function logOut() {
    setStatus(4);
    dispatch(setUser(null));
    try {
      await axios.delete("/api/logout");
    } catch (err) {
      console.log(err);
    }
    setInputsData(inputsDataDefault);
    setStatus(0);
  }

  // useEffect(() => {
  //   return () => {
  //     console.log("cancelling"); // bug: this is called right away!
  //     return sourceEmailCancelRef.current.cancel();
  //   };
  // }, []);

  if (user)
    return (
      <LittleMenu>
        <p>שלום לך, {user.name}</p>
        <button onClick={logOut}>התנתק</button>
      </LittleMenu>
    );

  return (
    <LittleMenu>
      {status === 0 && (
        <form>
          <h2>התחבר או הירשם</h2>
          <input
            style={{ textAlign: "center" }}
            type='email'
            placeholder='כתובת הדוא"ל שלך'
            onChange={handleInputChange}
            value={inputsData.email}
            name='email'
          />
          <button
            disabled={emailError(inputsData.email)}
            type='submit'
            onClick={handleEmailSubmit}
          >
            המשך
          </button>
        </form>
      )}
      {status === 1 && <p> שגיאה התרחשה, נסה שוב מאוחר יותר</p>}
      {status === 2 && <p>נא התחבר</p>}
      {status === 3 && (
        <Signup
          handleInputChange={handleInputChange}
          inputsData={inputsData}
          handleRegisteration={handleRegisteration}
        />
      )}
      {status === 4 && <Loading width='30px' height='30px' padding='10px' />}
      {/* {status === 5 && <p>היי, {localStorage.getItem("name")}</p>} */}
    </LittleMenu>
  );
}
