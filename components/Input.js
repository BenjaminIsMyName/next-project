import { useState } from "react";
import { useTranslation } from "next-i18next";
export default function Input(props) {
  const { t } = useTranslation("menu");
  const [error, setError] = useState("");
  const { checkErrorCallback, valueObj, name } = props;

  let copyOfProps = { ...props };
  delete copyOfProps.checkErrorCallback;
  delete copyOfProps.valueObj;
  delete copyOfProps.name;
  delete copyOfProps.icon;
  delete copyOfProps.className;

  // if the user fixed the error, remove the warning immediately
  if (error && !checkErrorCallback(valueObj[name])) setError("");

  return (
    <div className={`flex flex-col relative pt-4 ${error ? "invalid" : ""}`}>
      <input
        {...copyOfProps}
        className={`input w-full border-0 border-b-[1px_solid_rgba(var(--option-text-color),_0.4)] outline-0 text-base
        py-[7px] bg-[transparent] transition-[border-color] text-option-text-color
        placeholder:text-opacity-0
        ${props.className || ""}`}
        value={valueObj[name]}
        name={name}
        id={name}
        onBlur={() => {
          let errorTextKey = checkErrorCallback(valueObj[name]);
          if (errorTextKey) setError(t(errorTextKey));
          else setError("");
        }}
      />
      <label htmlFor={name} className={"formLabel"}>
        {props.placeholder}
      </label>
      <label htmlFor={name} className={"errorLabel"}>
        {error}
      </label>
    </div>
  );
}
