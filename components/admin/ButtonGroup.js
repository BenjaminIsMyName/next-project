import { motion } from "framer-motion";

export default function ButtonGroup({ buttons }) {
  return (
    <div className="flex justify-around items-stretch rounded-lg overflow-hidden">
      {buttons.map(buttonData => (
        <SingleButtonInGroup key={buttonData.key} data={buttonData} />
      ))}
    </div>
  );
}

function SingleButtonInGroup({ data }) {
  console.log(data);
  return (
    <motion.button
      className={`w-full p-2 relative bg-main-color/50`}
      onClick={data.set}
    >
      {data.isSelected && (
        <motion.div
          layoutId="selected"
          className="bg-third-color/40 absolute inset-0 z-10"
        ></motion.div>
      )}

      <span className="z-20 relative">{data.text}</span>
    </motion.button>
  );
}
