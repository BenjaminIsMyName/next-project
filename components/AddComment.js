export default function AddComment() {
  return (
    <div className="py-4 px-4 md:px-0">
      <textarea
        className="block resize-none w-full h-20 bg-main-color shadow-inner shadow-shadows-color p-3"
        placeholder="Write a comment..."
      ></textarea>
      <button
        type="button"
        className="block bg-third-color w-full p-2 mt-2 text-main-color"
      >
        Comment
      </button>
    </div>
  );
}
