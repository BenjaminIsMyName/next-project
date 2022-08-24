import styles from "./Input.module.css";
import { useState } from "react";
export default function Input(props) {
  const [error, setError] = useState("");
  const { checkErrorCallback, errorText, valueObj, name, icon } = props;

  let copyOfProps = { ...props };
  delete copyOfProps.checkErrorCallback;
  delete copyOfProps.errorText;
  delete copyOfProps.valueObj;
  delete copyOfProps.name;
  delete copyOfProps.icon;

  // if the user fixed the error, remove the warning immediately
  if (error && !checkErrorCallback(valueObj[name])) setError("");

  return (
    <div className={`${styles.container} ${error ? styles.invalid : ""}`}>
      <input
        {...copyOfProps}
        value={valueObj[name]}
        name={name}
        id={name}
        onBlur={() => {
          if (checkErrorCallback(valueObj[name])) setError(errorText);
          else setError("");
        }}
      />
      <label htmlFor={name} className={styles.formLabel}>
        {props.placeholder}
      </label>
      <label htmlFor={name} className={styles.errorLabel}>
        {error}
      </label>
    </div>
  );
}
