import { useTranslation } from "next-i18next";

export default function NothingError() {
  const { t } = useTranslation("common");
  return (
    <span className="block text-center text-option-text-color text-2xl animate-go-in py-60">
      {t("error-text.nothing-to-see-here", { ns: "common" })}
    </span>
  );
}
