import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import SelectedTopic from "./SelectedTopic";

export default function Topics({
  addTopicCallback,
  selectedTopics,
  setSelectedTopics,
}) {
  const { locale } = useRouter();
  const { t } = useTranslation(["common", "admin"]);
  return (
    <div className="py-2">
      <div className="flex gap-5 px-3 !py-4 md:p-1 overflow-x-auto overflow-y-hidden [&_svg]:flex-shrink-0">
        <button
          className="whitespace-nowrap bg-third-color p-3 rounded-md bg-opacity-40 shadow-md shadow-shadows-color"
          onClick={addTopicCallback}
        >
          {t("add-topic", { ns: "admin" }).toUpperCase()}
        </button>
        {selectedTopics.map(i => (
          <SelectedTopic
            key={i._id}
            removeCallback={() =>
              setSelectedTopics(prev => prev.filter(j => j._id !== i._id))
            }
            text={locale === "en" ? i.english : i.hebrew}
          />
        ))}
      </div>
    </div>
  );
}
