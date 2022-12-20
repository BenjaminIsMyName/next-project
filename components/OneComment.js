import { format, formatDistance } from "date-fns";
import { he } from "date-fns/locale";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function OneComment({
  text,
  user,
  date,
  didLike,
  name,
  numberOfLikes,
  likeCallback,
}) {
  const { locale } = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  let formattedDate = isClient ? getFormattedDate() : "";

  function getFormattedDate() {
    return formatDistance(new Date(date), new Date(), {
      addSuffix: true,
      locale: locale === "en" ? undefined : he,
    });
  }

  return (
    <div className="p-2 shadow-sm shadow-shadows-color">
      <div className="flex gap-1 flex-row items-end text-xs">
        <span>{name}</span>
        <span className="text-option-text-color text-opacity-70">
          {formattedDate}
        </span>
      </div>
      <span>{text}</span>
      <div>
        <span>{numberOfLikes}</span>
      </div>
    </div>
  );
}
