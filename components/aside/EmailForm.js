import styles from "./EmailForm.module.css";
import { emailError } from "../../util/validate";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Input from "../Input";
import EmailIcon from "@mui/icons-material/Email";
export default function EmailForm({
  handleInputChange,
  inputsData,
  handleEmailSubmit,
}) {
  // const [error, setError] = useState("");

  // if the user fixed the error, remove the warning immediately
  // if (error && !emailError(inputsData.email)) setError("");

  return (
    <form className='form'>
      <h2>התחבר או הירשם</h2>
      {/* <div>
        <input
          className={error ? "invalid" : ""}
          style={{ textAlign: "center" }}
          type='email'
          placeholder='כתובת הדוא"ל שלך'
          onChange={handleInputChange}
          value={inputsData.email}
          name='email'
          id='email'
          onBlur={() => {
            if (emailError(inputsData.password))
              setError(`כתובת דוא"ל אינה תקינה`);
            else setError("");
          }}
        />
        {error && <label htmlFor='email'>{error}</label>}
      </div> */}
      {/* <TextField
        type='email'
        color='text'
        className={`input ${error ? "invalidInput" : ""}`}
        id='standard-basic'
        label='דוא"ל'
        variant='standard'
        onChange={handleInputChange}
        value={inputsData.email}
        name='email'
        onBlur={() => {
          if (emailError(inputsData.password))
            setError(`כתובת דוא"ל אינה תקינה`);
          else setError("");
        }}
        helperText={error}
        error={error ? true : false}
      /> */}
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
