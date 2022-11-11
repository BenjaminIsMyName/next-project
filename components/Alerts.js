import { useRouter } from "next/router";

export default function Alerts({ alerts, remove }) {
  const router = useRouter();
  const locale = router.locale;

  return (
    <div
      className={`fixed bottom-3 flex flex-col gap-3
      ${locale === "en" ? "right-3" : "left-3"}
    z-10`}
    >
      {alerts.map(i => (
        <div className="bg-error-color p-3 flex gap-2" key={i.id}>
          <span>{i.title}</span>
          <button onClick={() => remove(i.id)}>X</button>
        </div>
      ))}
    </div>
  );
}
