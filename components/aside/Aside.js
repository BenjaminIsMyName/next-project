import Option from "./Option.js";
import Header from "./Header.js";
import styles from "./Aside.module.css";
import { useRef, forwardRef, useImperativeHandle } from "react";

let Aside = ({ menuOnClickHandler, isOpen }, ref) => {
  const asideRef = useRef();
  useImperativeHandle(ref, () => ({
    theElement: asideRef.current,
  }));

  return (
    <aside
      ref={asideRef}
      className={`${styles.aside} ${isOpen ? styles.clicked : ""}`}
    >
      <Header
        menuOnClickHandler={() => menuOnClickHandler(asideRef)}
        asideRef={asideRef}
        isOpen={isOpen}
      />
      <Option text='בשבילך' link='./' selected />
      <Option text='פופולרי' link='./' />
      <Option text='נושאים' link='./' />
      <Option text='הגדרות' link='./' />
    </aside>
  );
};

export default Aside = forwardRef(Aside);
