import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";

export default function Alerts({ alerts, remove }) {
  const router = useRouter();
  const locale = router.locale;

  return (
    <div
      data-short-description="alerts"
      data-description="this is the div that contains the alerts"
      className={`fixed bottom-[calc(12px+var(--header-height))] md:bottom-3 flex items-end flex-col gap-3
      left-3 right-3
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
            // exit={{ x: locale === "en" ? "200%" : "-200%", opacity: 0.5 }} // see bug: https://github.com/framer/motion/issues/1769
            className={`${
              i.color === "success" ? "bg-third-color" : "bg-error-color"
            } p-3 flex gap-2`}
            key={i.id}
          >
            <span className="text-main-color">{i.title}</span>
            <button className="text-main-color" onClick={() => remove(i.id)}>
              X
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
