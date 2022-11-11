import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";

export default function Alerts({ alerts, remove }) {
  const router = useRouter();
  const locale = router.locale;

  return (
    <div
      className={`fixed bottom-[calc(12px+var(--header-height))] md:bottom-3 flex flex-col gap-3
      ${locale === "en" ? "right-3" : "left-3"}
    z-10`}
    >
      <AnimatePresence>
        {alerts.map(i => (
          <motion.div
            layout
            initial={{
              x: locale === "en" ? 200 : -200,
              opacity: 0.5,
              rotate: locale === "en" ? -240 : 240,
            }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: locale === "en" ? "200%" : "-200%", opacity: 0.5 }}
            className="bg-error-color p-3 flex gap-2"
            key={i.id}
          >
            <span>{i.title}</span>
            <button onClick={() => remove(i.id)}>X</button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
