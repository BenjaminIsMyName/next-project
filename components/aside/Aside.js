import FocusTrap from "focus-trap-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../../store/menuSlice.js";
import LittleMenu from "../LittleMenu.js";
import styles from "./Aside.module.css";
import Header from "./Header.js";
import Option from "./Option.js";
import ProfileMenu from "./ProfileMenu.js";
import { useTranslation } from "next-i18next";
import { getCookie } from "cookies-next";
// import { serverSideTranslations } from "next-i18next/serverSideTranslations";
export default function Aside() {
  const { t, i18n } = useTranslation("menu");

  const asideRef = useRef(); // used on the <aside> tag, to scroll back up when openning and closing the menu.
  const dispatch = useDispatch(); // to set the state in redux toolkit
  const isOpen = useSelector(state => state.menu); // to check the state in redux toolkit
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
  const [lang, setLang] = useState("");

  useEffect(() => {
    setLang(getCookie("lang"));
  }, []);
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
        {littleMenuOpen === 0 && <ProfileMenu />}
        {littleMenuOpen === 1 && <LittleMenu>Notifications menu</LittleMenu>}
        {littleMenuOpen === 2 && <LittleMenu>Search menu</LittleMenu>}
        <aside
          ref={asideRef}
          className={`${styles.aside} ${isOpen ? styles.clicked : ""} 
          ${lang === "en-US" ? styles.asideLtr : ""}`}
          onClick={() => setLittleMenuOpen(-1)}
        >
          <Header
            littleMenuOpen={littleMenuOpen}
            setLittleMenuOpen={setLittleMenuOpen}
            menuOnClickHandler={clickToToggleMenu}
            isOpen={isOpen}
          />
          <Option text={t("for-you")} link='./' selected />
          <Option text={t("popular")} link='./' />
          <Option text={t("topics")} link='./' />
          <Option text={t("settings")} link='./' />
        </aside>
      </div>
    </FocusTrap>
  );
}

// export async function getStaticProps(ctx) {
//   // query db for posts here.
//   // using the next.js api here won't work at build time.
//   // so we need to fetch it directly the db.
//   // for more info: https://nextjs.org/docs/basic-features/data-fetching/get-static-props#write-server-side-code-directly

//   return {
//     props: {
//       ...(await serverSideTranslations(ctx.locale, ["menu"])),
//     },
//   };
// }
