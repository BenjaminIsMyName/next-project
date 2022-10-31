import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

export default function ThemeButton({
  description,
  themeName,
  setSelected,
  selected,
}) {
  const { setTheme } = useContext(ThemeContext);
  return (
    <button
      type="button"
      title={description}
      aria-label={description}
      style={{
        background: `linear-gradient(45deg,rgb(var(--${themeName}-second-color)),rgb(var(--${themeName}-third-color)))`,
      }}
      className={`rounded-md w-full h-5 cursor-pointer 
        transition-all duration-300 ease-in relative border-0 
        before:rounded-md before:z-[-1] before:content-[''] before:absolute before:bottom-0 
        before:left-2/4 before:mb-[-4px] before:translate-x-[-50%] before:w-0
        before:bg-gradient-to-r before:from-option-text-color/40 before:to-error-color 
        before:duration-500 before:h-[calc(100%+8px)]
        hover:rounded-2xl
       ${
         selected === themeName
           ? "shadow-[0_0_0_1px_white,0_0_0_2px_black]"
           : "hover:before:w-[calc(100%+8px)] hover:before:left-0 hover:before:ml-[-4px] hover:before:translate-x-0 hover:before:rounded-2xl"
       }`}
      onClick={() => {
        setTheme(themeName);
        setSelected(themeName);
      }}
    ></button>
  );
}
