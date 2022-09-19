import styles from "./OverlayToContinue.module.css";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import Link from "next/link";
export default function OverlayToContinue({ onSuccess }) {
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    document.body.classList.add("no-scroll-in-any-screen");
    return () => document.body.classList.remove("no-scroll-in-any-screen");
  }, []);

  return (
    <div className={`${styles.overlay}`}>
      {/* buttons and links don't work here, wtf */}
    </div>
  );
}
