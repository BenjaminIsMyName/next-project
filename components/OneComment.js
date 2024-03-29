import { formatDistance } from "date-fns";
import { he } from "date-fns/locale";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import useLoaded from "../hooks/useLoaded";
import LikeIcon from "./icons/LikeIcon";

export default function OneComment({
  text,
  date,
  didLike,
  name,
  numberOfLikes,
  likeCallback,
  id,
  deletedAccount,
}) {
  const { locale } = useRouter();

  const loaded = useLoaded();
  const { t } = useTranslation("common");
  let formattedDate = loaded ? getFormattedDate() : "";

  function getFormattedDate() {
    return formatDistance(new Date(date), new Date(), {
      addSuffix: true,
      locale: locale === "en" ? undefined : he,
    });
  }

  return (
    <div className="p-2 border-b-2 border-main-color">
      <div className="flex gap-1 flex-row items-end text-xs">
        <span
          className={`${
            deletedAccount
              ? "line-through decoration-error-color/50 decoration-2"
              : ""
          }`}
        >
          {deletedAccount ? t("deleted-account", { ns: "common" }) : name}
        </span>
        <span className="text-option-text-color text-opacity-70">
          {formattedDate}
        </span>
      </div>
      {/* the "whitespace-pre-wrap" is for displaying comments with line break. Show multiple lines... */}
      <span className="whitespace-pre-wrap break-words">{text}</span>
      <div>
        <div
          className={`py-2 flex gap-2 [&_svg]:w-5 [&_svg]:h-5 [&_svg]:cursor-pointer ${
            didLike
              ? "[&_svg]:fill-third-color"
              : "[&_svg]:fill-option-text-color"
          }`}
        >
          <button
            aria-label={t("aria-labels.like", { ns: "common" })}
            className={`bg-opacity-0 border-0`}
            type="button"
            onClick={() => likeCallback(id)}
          >
            <LikeIcon />
          </button>
          <span>{numberOfLikes}</span>
        </div>
      </div>
    </div>
  );
}
