import CopyIcon from "./icons/CopyIcon";
import ButtonForPost from "./ButtonForPost";

export default function PostOptions() {
  return (
    <div className="py-2 px-4 md:px-0">
      <div className="flex gap-5 p-3 md:p-1 overflow-x-auto [&_svg]:flex-shrink-0">
        <ButtonForPost>
          <CopyIcon />
          <span>Share</span>
        </ButtonForPost>
        <ButtonForPost>
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
