import CopyIcon from "./icons/CopyIcon";
import ButtonForPost from "./ButtonForPost";
import { useContext } from "react";
import { AlertContext } from "../context/AlertContext";

export default function PostOptions({ post, editClick }) {
  const { add } = useContext(AlertContext);
  function handleShare() {
    navigator.clipboard.writeText(`${window.location.href}`);
    add({ title: "Copied", color: "success" });
  }

  return (
    <div className="py-2 px-4 md:px-0">
      <div className="flex gap-5 p-3 md:p-1 overflow-x-auto [&_svg]:flex-shrink-0">
        <ButtonForPost onClick={handleShare}>
          <CopyIcon />
          <span>Share</span>
        </ButtonForPost>
        <ButtonForPost onClick={editClick}>
          <CopyIcon />
          <span>Edit</span>
        </ButtonForPost>
        <ButtonForPost>
          <CopyIcon />
          <span>Delete</span>
        </ButtonForPost>
        <ButtonForPost>
          <CopyIcon />
          <span>Save</span>
        </ButtonForPost>
      </div>
    </div>
  );
}
