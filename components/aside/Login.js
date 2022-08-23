import styles from "./Login.module.css";
import { emailError, passwordError } from "../../util/validate";
import { useState } from "react";
import Input from "../Input";
export default function Login({
  handleInputChange,
  inputsData,
  handleLogin,
  goBack,
}) {
  return (
    <>
      <button onClick={goBack}>חזור</button>
      <form className={`form`}>
        <h2> נא התחבר </h2>
        <Input
          checkErrorCallback={emailError}
          errorText={`כתובת דוא"ל אינה תקינה`}
          valueObj={inputsData}
          onChange={handleInputChange}
          type='email'
          name='email'
          placeholder='דוא"ל'
          disabled={true}
        />
        <Input
          checkErrorCallback={passwordError}
          errorText={
            "סיסמה חייבת להיות לפחות 6 תווים, עם מספרים ואותיות לועזיות"
          }
          valueObj={inputsData}
          onChange={handleInputChange}
          type='password'
          name='password'
          placeholder='סיסמה'
        />
        <button
          disabled={
            emailError(inputsData.email) || passwordError(inputsData.password)
          }
          onClick={handleLogin}
        >
          התחבר
        </button>
      </form>
    </>
  );
}
