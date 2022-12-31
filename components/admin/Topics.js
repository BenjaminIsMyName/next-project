import { useRouter } from "next/router";
import SelectedTopic from "./SelectedTopic";

export default function Topics({
  addTopicCallback,
  selectedTopics,
  setSelectedTopics,
}) {
  const { locale } = useRouter();

  return (
    <div className="py-2 px-4 md:px-0">
      <div className="flex gap-5 p-3 md:p-1 overflow-x-auto [&_svg]:flex-shrink-0">
        <button
          className="whitespace-nowrap bg-third-color p-3 rounded-md bg-opacity-40"
          onClick={addTopicCallback}
        >
          ADD A TOPIC
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
