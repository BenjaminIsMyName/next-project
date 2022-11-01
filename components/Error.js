export default function Error({ tryAgainCallback, error }) {
  return (
    <div className={`p-12 animate-up`}>
      <span className="text-2xl font-bold text-center text-third-color text-opacity-50 p-1">
        {error.toString()}
      </span>
      {tryAgainCallback && (
        <button
          className="block text-2xl font-bold text-center text-third-color bg-second-color border-0 rounded-md p-2 my-2 mx-auto cursor-pointer"
          type="button"
          onClick={tryAgainCallback}
        >
          נסה שוב
        </button>
      )}
    </div>
  );
}
