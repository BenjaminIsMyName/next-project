import Link from "next/link";
import CommentIcon from "./icons/CommentIcon";

export default function GoToComments({
  isFullyOpened,
  handleScrollToComments,
  localPost,
  route,
  query,
}) {
  if (isFullyOpened) {
    return (
      <button
        onClick={() => {
          handleScrollToComments();
        }}
        aria-label={"Comment"}
        className={`bg-opacity-0 border-0`}
        type="button"
      >
        <CommentIcon />
      </button>
    );
  }

  return (
    <Link
      scroll={false}
      // shallow={true}
      href={{
        pathname: `${route}`,
        query: {
          post: localPost?._id,
          id: query.id,
          scrollToComments: true,
        }, // "id" is for the topicId, when viewing a topic
      }}
      as={localPost ? `/post/${localPost?._id}` : "/"}
    >
      <a className="flex justify-center">
        <button
          aria-label={"Comment"}
          className={`bg-opacity-0 border-0`}
          type="button"
        >
          <CommentIcon />
        </button>
      </a>
    </Link>
  );
}