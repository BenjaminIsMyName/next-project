import styles from "./EmailForm.module.css";
import { emailError } from "../../util/validate";
import Input from "../Input";

export default function EmailForm({
  handleInputChange,
  inputsData,
  handleEmailSubmit,
}) {
  return (
    <form className='form'>
      <h2>התחבר או הירשם</h2>
      <Input
        checkErrorCallback={emailError}
        errorText={`כתובת דוא"ל אינה תקינה`}
        valueObj={inputsData}
        onChange={handleInputChange}
        type='email'
        name='email'
        placeholder='דוא"ל'
      />

      <button
        disabled={emailError(inputsData.email)}
        onClick={handleEmailSubmit}
      >
        המשך
      </button>
    </form>
  );
}
