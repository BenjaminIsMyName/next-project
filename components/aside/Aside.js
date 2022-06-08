import FocusTrap from "focus-trap-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../../store/menuSlice.js";
import LittleMenu from "../LittleMenu.js";
import styles from "./Aside.module.css";
import Header from "./Header.js";
import Option from "./Option.js";
export default function Aside() {
  const asideRef = useRef();
  const dispatch = useDispatch();
  const isOpen = useSelector(state => state.menu);
  const [littleMenuOpen, setLittleMenuOpen] = useState(-1); // is a little menu open? (none: -1, profile menu: 0, notifications menu: 1, search menu: 2)

  const clickToToggleMenu = useCallback(() => {
    dispatch(toggleMenu());
    document.body.classList.toggle("no-scroll");
    asideRef.current.scrollTop = 0;

    // scroll to the top after it's opened a little bit - needed for Chrome, not for Firefox:

    setTimeout(() => {
      asideRef.current.scrollTop = 0;
    }, 2);

    setTimeout(() => {
      asideRef.current.scrollTop = 0;
    }, 5);
  }, [dispatch]);

  function handleOverlayClick() {
    if (littleMenuOpen !== -1 && isOpen) {
      clickToToggleMenu();
      setLittleMenuOpen(-1);
    } else if (isOpen) {
      clickToToggleMenu();
    } else {
      setLittleMenuOpen(-1);
    }
  }

  // this is needed to close the big menu when you open a little menu (why? for very small screens)
  useEffect(() => {
    if (isOpen && littleMenuOpen !== -1) {
      clickToToggleMenu();
    }
  }, [littleMenuOpen, isOpen, clickToToggleMenu]); // it's ok to remove this dependency array, and let it run on each render.

  return (
    <FocusTrap active={littleMenuOpen !== -1 || isOpen}>
      <div>
        <div
          onClick={handleOverlayClick}
          className={`${styles.overlay} ${
            littleMenuOpen !== -1
              ? styles.backdropDesktop
              : isOpen
              ? styles.backdrop
              : ""
          }`}
        ></div>
        {littleMenuOpen === 0 && <LittleMenu>Profile menu</LittleMenu>}
        {littleMenuOpen === 1 && <LittleMenu>Notifications menu</LittleMenu>}
        {littleMenuOpen === 2 && <LittleMenu>Search menu</LittleMenu>}
        <aside
          ref={asideRef}
          className={`${styles.aside} ${isOpen ? styles.clicked : ""}`}
          onClick={() => setLittleMenuOpen(-1)}
        >
          <Header
            littleMenuOpen={littleMenuOpen}
            setLittleMenuOpen={setLittleMenuOpen}
            menuOnClickHandler={clickToToggleMenu}
            asideRef={asideRef}
            isOpen={isOpen}
          />
          <Option text='בשבילך' link='./' selected />
          <Option text='פופולרי' link='./' />
          <Option text='נושאים' link='./' />
          <Option text='הגדרות' link='./' />
        </aside>
      </div>
    </FocusTrap>
  );
}
