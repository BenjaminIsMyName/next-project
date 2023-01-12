import CopyIcon from "./icons/CopyIcon";
import ButtonForPost from "./ButtonForPost";
import { useContext, useEffect, useState } from "react";
import { AlertContext } from "../context/AlertContext";
import { UserContext } from "../context/UserContext";

export default function PostOptions({
  post,
  editClick,
  deleteClick,
  savePost,
}) {
  const { add } = useContext(AlertContext);
  const { user } = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState(false);
  function handleShare() {
    navigator.clipboard.writeText(`${window.location.href}`);
    add({ title: "Copied", color: "success" });
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
          <TextForPost text={"Share"} />
        </ButtonForPost>

        <ButtonForPost onClick={savePost}>
          <CopyIcon />
          <TextForPost text={post.isSaved ? "Remove" : "Save"} />
        </ButtonForPost>

        {isAdmin && (
          <>
            <ButtonForPost onClick={editClick}>
              <CopyIcon />
              <TextForPost text={"Edit"} />
            </ButtonForPost>

            <ButtonForPost onClick={deleteClick}>
              <CopyIcon />
              <TextForPost text={"Delete"} />
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
