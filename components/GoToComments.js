import { useTranslation } from "next-i18next";
import Link from "next/link";
import CommentIcon from "./icons/CommentIcon";

export default function GoToComments({
  isFullyOpened,
  handleScrollToComments,
  localPost,
  route,
  query,
}) {
  const { t } = useTranslation(["common"]);
  if (isFullyOpened) {
    return (
      <button
        onClick={() => {
          handleScrollToComments();
        }}
        aria-label={t("aria-labels.comment", { ns: "common" })}
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
      <a className="flex justify-center" tabIndex={-1}>
        <button
          aria-label={t("aria-labels.comment", { ns: "common" })}
          className={`bg-opacity-0 border-0`}
          type="button"
        >
          <CommentIcon />
        </button>
      </a>
    </Link>
  );
}
