import { useTranslation } from "next-i18next";
import { useContext, useState } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import ThemeButton from "./ThemeButton";
import styles from "./ThemesSection.module.css";

export default function ThemesSection() {
  const { theme } = useContext(ThemeContext);
  const [selected, setSelected] = useState(theme.current); // we need this just to re-render this compoennt when theme selection change, to apply style to the selected button
  const { t } = useTranslation("menu");

  function handleThemeChange(value) {
    theme.current = value;
    setSelected(value);
  }
  return (
    <div className={styles.themeContainer}>
      <ThemeButton
        setSelected={handleThemeChange}
        selected={selected}
        description={t("themes.dark-green")}
        themeName={"darkgreen"} // giving this default theme a name is only to apply the className
      />
      <ThemeButton
        setSelected={handleThemeChange}
        selected={selected}
        description={t("themes.dark-blue")}
        themeName={"darkblue"}
      />

      <ThemeButton
        setSelected={handleThemeChange}
        selected={selected}
        description={t("themes.light-green")}
        themeName={"lightgreen"}
      />
      <ThemeButton
        setSelected={handleThemeChange}
        selected={selected}
        description={t("themes.light-blue")}
        themeName={"lightblue"}
      />
    </div>
  );
}
