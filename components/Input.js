import styles from "./Input.module.css";
import { useState } from "react";
import { useTranslation } from "next-i18next";
export default function Input(props) {
  const { t } = useTranslation("menu");
  const [error, setError] = useState("");
  const { checkErrorCallback, valueObj, name, icon } = props;

  let copyOfProps = { ...props };
  delete copyOfProps.checkErrorCallback;
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
          let errorTextKey = checkErrorCallback(valueObj[name]);
          if (errorTextKey) setError(t(errorTextKey));
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
