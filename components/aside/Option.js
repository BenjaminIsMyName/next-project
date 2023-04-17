import styles from "./Options.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function Option({ text, link, onClick, icon, newTab }) {
  const IconComponent = icon();
  const router = useRouter();
  const locale = router.locale;

  return (
    <Link href={link} scroll={false}>
      <a
        target={newTab ? "_blank" : "_self"}
        onClick={onClick}
        className={`${styles.option} ${
          locale === "en" ? styles.optionLtr : ""
        } ${router.route === link ? "[&_svg]:animate-go-in" : ""} `}
        id={router.route === link ? styles.selected : ""}
      >
        <div className="z-20 flex gap-5 relative items-center">
          <IconComponent />
          <span>{text}</span>
        </div>
        {router.route === link && (
          <motion.div
            layoutId="selected"
            className="absolute inset-0 bg-main-color z-10 rounded-e-full"
          ></motion.div>
        )}
      </a>
    </Link>
  );
}
