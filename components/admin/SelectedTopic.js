import { motion } from "framer-motion";

export default function SelectedTopic({ text, removeCallback }) {
  return (
    <motion.div
      layout
      className="w-max inline-flex gap-4 items-center justify-center bg-main-color py-2 px-5 rounded-lg [&_svg]:w-4 [&_svg]:fill-option-text-color shadow-md shadow-shadows-color"
    >
      <span className="whitespace-nowrap">{text}</span>
      <button onClick={removeCallback}>⛔</button>
    </motion.div>
  );
}
