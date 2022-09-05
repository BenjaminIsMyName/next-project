import styles from "./Signup.module.css";
import { emailError, passwordError, nameError } from "../../util/validate";
import Input from "../Input";
export default function Signup({
  handleInputChange,
  inputsData,
  handleRegisteration,
  goBack,
}) {
  return (
    <>
      <button onClick={goBack}>חזור</button>
      <form className={`form`}>
        <p>אין לך חשבון - נא הירשם</p>
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

        <Input
          checkErrorCallback={nameError}
          errorText={"שם חייב להיות לפחות 3 תווים"}
          valueObj={inputsData}
          onChange={handleInputChange}
          type='text'
          name='name'
          placeholder='שם'
        />
        <button
          disabled={
            emailError(inputsData.email) ||
            passwordError(inputsData.password) ||
            nameError(inputsData.name)
          }
          onClick={handleRegisteration}
        >
          הירשם
        </button>
      </form>
    </>
  );
}
