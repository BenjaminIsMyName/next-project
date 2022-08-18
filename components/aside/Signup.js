import styles from "./Signup.module.css";
import { emailError, passwordError, nameError } from "../../util/validate";
export default function Signup({
  handleInputChange,
  inputsData,
  handleRegisteration,
}) {
  // TODO: put 'pattern' in all the inputs, so css will know when input is invalid
  // TODO: show errors somehow, after submitting / leaving focus
  return (
    <form className={styles.form}>
      <p>נא הירשם</p>
      <input
        type='email'
        placeholder='כתובת הדוא"ל שלך'
        onChange={handleInputChange}
        value={inputsData.email}
        name='email'
        required
      />
      <input
        name='password'
        type='password'
        placeholder='סיסמה'
        onChange={handleInputChange}
        value={inputsData.password}
        required
      />
      <input
        value={inputsData.name}
        name='name'
        type='text'
        placeholder='שם'
        onChange={handleInputChange}
        required
      />

      <button
        disabled={
          emailError(inputsData.email) ||
          passwordError(inputsData.password) ||
          nameError(inputsData.name)
        }
        type='submit'
        onClick={handleRegisteration}
      >
        הירשם
      </button>
    </form>
  );
}
