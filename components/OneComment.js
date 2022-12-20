export default function OneComment({
  text,
  user,
  date,
  didLike,
  name,
  numberOfLikes,
  likeCallback,
}) {
  return (
    <div className="p-2 shadow-sm shadow-shadows-color">
      <div className="flex gap-1 flex-row items-end text-xs">
        <span>{name}</span>
        <span className="text-option-text-color text-opacity-70">{date}</span>
      </div>
      <span>{text}</span>
      <div>
        <span>{numberOfLikes}</span>
      </div>
    </div>
  );
}
