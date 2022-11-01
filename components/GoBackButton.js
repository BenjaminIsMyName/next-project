import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import GoBackIcon from "./icons/GoBackIcon";

export default function GoBackButton({ callback }) {
  const { t } = useTranslation("menu");
  const { locale } = useRouter();

  return (
    <button
      title={t("actions.back")}
      className={`bg-opacity-0 w-5 border-0 cursor-pointer fill-option-text-color 
      [&_svg]:transition-all hover:[&_svg]:fill-option-text-color/50
      ${
        locale === "en"
          ? "rotate-0 hover:[&_svg]:rotate-[20deg]"
          : "rotate-180 hover:[&_svg]:rotate-[-20deg]"
      }`}
      type="button"
      onClick={callback}
    >
      <GoBackIcon />
    </button>
  );
}
