import { useState } from "react";
import { useTranslation } from "next-i18next";
export default function Input(props) {
  const { t } = useTranslation(["menu", "admin"]);
  const [error, setError] = useState("");
  const { checkErrorCallback, valueObj, name } = props;

  let copyOfProps = { ...props };
  delete copyOfProps.checkErrorCallback;
  delete copyOfProps.valueObj;
  delete copyOfProps.name;
  delete copyOfProps.icon;
  delete copyOfProps.className;
  delete copyOfProps.removeDefaultStyle;
  delete copyOfProps.translationFile;

  // if the user fixed the error, remove the warning immediately
  if (error && !checkErrorCallback(valueObj[name])) setError("");
  return (
    <div className={`flex flex-col relative pt-4 ${error ? "invalid" : ""}`}>
      <input
        {...copyOfProps}
        className={`${
          props.removeDefaultStyle
            ? ""
            : "input w-full border-0 border-b-[1px] border-b-option-text-color border-opacity-40 outline-0 text-base py-[7px] bg-[transparent] transition-[border-color] text-option-text-color placeholder:text-opacity-0 outline-none"
        } ${props.className || ""}`}
        value={valueObj[name]}
        name={name}
        id={name}
        onBlur={() => {
          let errorTextKey = checkErrorCallback(valueObj[name]);
          if (errorTextKey) setError(errorTextKey);
          else setError("");
        }}
      />
      {props.removeDefaultStyle || (
        <label htmlFor={name} className={"formLabel"}>
          {props.placeholder}
        </label>
      )}
      <label htmlFor={name} className={"errorLabel"}>
        {t(error, { ns: props.translationFile || "menu" })}
      </label>
    </div>
  );
}
