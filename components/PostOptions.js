import CopyIcon from "./icons/CopyIcon";
import ButtonForPost from "./ButtonForPost";
import { useContext, useEffect, useState } from "react";
import { AlertContext } from "../context/AlertContext";
import { UserContext } from "../context/UserContext";
import { useTranslation } from "next-i18next";
import UnsaveIcon from "./icons/UnsaveIcon";
import SaveIcon from "./icons/SaveIcon";
import EditIcon from "./icons/EditIcon";
import DeleteIcon from "./icons/DeleteIcon";
import useLoaded from "../hooks/useLoaded";

export default function PostOptions({
  post,
  editClick,
  deleteClick,
  savePost,
}) {
  const { add } = useContext(AlertContext);
  const { user } = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const { t } = useTranslation(["common"]);
  const loaded = useLoaded();

  function handleShare() {
    navigator.clipboard.writeText(`${window.location.href}`);
    add({ title: t("alerts.copied", { ns: "common" }), color: "success" });
  }

  // apply changes only on the client side. otherwise - we'll get a warning...
  useEffect(() => {
    setIsAdmin(user?.isAdmin || false);
  }, [user]);

  return (
    <div className="py-2 px-4 md:px-0">
      <div className="flex gap-5 p-3 md:p-1 overflow-x-auto [&_svg]:flex-shrink-0">
        <ButtonForPost onClick={handleShare}>
          <CopyIcon />
          <TextForPost text={t("share")} />
        </ButtonForPost>

        {user && loaded && (
          <ButtonForPost onClick={savePost}>
            {post.isSaved ? <UnsaveIcon /> : <SaveIcon />}
            <TextForPost text={post.isSaved ? t("unsave") : t("save")} />
          </ButtonForPost>
        )}

        {isAdmin && (
          <>
            <ButtonForPost onClick={editClick}>
              <EditIcon />
              <TextForPost text={t("edit")} />
            </ButtonForPost>

            <ButtonForPost onClick={deleteClick}>
              <DeleteIcon />
              <TextForPost text={t("delete")} />
            </ButtonForPost>
          </>
        )}
      </div>
    </div>
  );
}

function TextForPost({ text }) {
  return <span className="whitespace-nowrap">{text}</span>;
}
