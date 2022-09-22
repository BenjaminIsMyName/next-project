import styles from "./LittleMenu.module.css";
import { useContext } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
export default function LittleMenu({ children }) {
  const { locale } = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, transform: "scale(0.5)" }}
      animate={{ opacity: 1, transform: "scale(1)" }}
      transition={{ delay: 0.1, type: "tween", duration: 0.2 }}
      className={`${styles.container} ${
        locale === "en" ? styles.containerLtr : ""
      }`}
    >
      {children}
    </motion.div>
  );
}
