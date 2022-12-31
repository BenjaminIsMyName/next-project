import SelectedTopic from "./SelectedTopic";

export default function Topics({ addTopicCallback }) {
  return (
    <div className="py-2 px-4 md:px-0">
      <div className="flex gap-5 p-3 md:p-1 overflow-x-auto [&_svg]:flex-shrink-0">
        <button
          className="whitespace-nowrap bg-third-color p-3 rounded-md bg-opacity-40"
          onClick={addTopicCallback}
        >
          ADD A TOPIC
        </button>
        <SelectedTopic text={"Donald Trump"} />
        <SelectedTopic text={"Donald Trump"} />
        <SelectedTopic text={"Donald Trump"} />
        <SelectedTopic text={"Donald Trump"} />
        <SelectedTopic text={"Donald Trump"} />
      </div>
    </div>
  );
}
