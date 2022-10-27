import { useTranslation } from "next-i18next";
import { useState } from "react";
import ThemeButton from "./ThemeButton";
import styles from "./ThemesSection.module.css";

export default function ThemesSection() {
  // we need state just to re-render this component when theme selection change,
  // to apply style to the selected button
  const [selected, setSelected] = useState(document.body.dataset.theme);
  const { t } = useTranslation("menu");

  return (
    <div className={styles.themeContainer}>
      <ThemeButton
        setSelected={setSelected}
        selected={selected}
        description={t("themes.dark-green")}
        themeName={"darkgreen"} // giving this default theme a name is only to apply the className
      />
      <ThemeButton
        setSelected={setSelected}
        selected={selected}
        description={t("themes.dark-blue")}
        themeName={"darkblue"}
      />

      <ThemeButton
        setSelected={setSelected}
        selected={selected}
        description={t("themes.light-green")}
        themeName={"lightgreen"}
      />
      <ThemeButton
        setSelected={setSelected}
        selected={selected}
        description={t("themes.light-blue")}
        themeName={"lightblue"}
      />
    </div>
  );
}
