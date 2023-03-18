export default function ErrorText({ code, text }) {
  return (
    <>
      <br />
      <br />
      <br />
      <h1 className="text-center text-error-color text-2xl">
        <span className="font-bold">{code}</span>
        <span className="text-opacity-50 text-4xl mx-2">|</span>
        <span>{text}</span>
      </h1>
    </>
  );
}
