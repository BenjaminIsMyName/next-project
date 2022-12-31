import { motion as m } from "framer-motion";
import { useRouter } from "next/router";
import GoBackButton from "../GoBackButton";

export default function TopicsModal({ closeCallback }) {
  const { locale } = useRouter();
  return (
    <m.div
      initial={{ scale: 0, rotate: 40, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      exit={{ scale: 0, rotate: 40, opacity: 0 }}
      transition={{ ease: "easeIn", duration: 0.2, opacity: 0 }}
      className="absolute inset-0 bg-second-color bg-opacity-80 z-20 backdrop-blur-md"
    >
      {/* <button onClick={closeCallback}>❌</button> */}
      <div
        className={`fixed top-4 ${
          locale === "en" ? "left-4" : "right-4"
        } bg-main-color bg-opacity-40 backdrop-blur-3xl p-2 flex rounded-full`}
      >
        <GoBackButton callback={closeCallback} />
      </div>

      <span>Hey</span>
    </m.div>
  );
}
