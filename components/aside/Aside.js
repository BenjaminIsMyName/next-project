import FocusTrap from "focus-trap-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Modal from "../Modal.js";
import styles from "./Aside.module.css";
import Header from "./Header.js";
import Option from "./Option.js";
import ProfileModal from "./profileModal/ProfileModal";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

export default function Aside() {
  const { t } = useTranslation("menu");
  const { locale } = useRouter();
  const asideRef = useRef(); // used on the <aside> tag, to scroll back up when openning and closing the menu.
  const [isOpen, setIsOpen] = useState(false); // is the <aside> open, on mobile
  const [modalOpen, setModalOpen] = useState(-1); // is a little menu open? (none: -1, profile menu: 0, notifications menu: 1, search menu: 2)

  const clickToToggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
    document.body.classList.toggle("no-scroll");
    asideRef.current.scrollTop = 0;

    // scroll to the top after it's opened a little bit - needed for Chrome, not for Firefox:

    setTimeout(() => {
      asideRef.current.scrollTop = 0;
    }, 2);

    setTimeout(() => {
      asideRef.current.scrollTop = 0;
    }, 5);
  }, []);

  function handleOverlayClick() {
    if (modalOpen !== -1 && isOpen) {
      clickToToggleMenu();
      setModalOpen(-1);
    } else if (isOpen) {
      clickToToggleMenu();
    } else {
      setModalOpen(-1);
    }
  }

  // this is needed to close the big menu when you open a little menu (why? for very small screens)
  useEffect(() => {
    if (isOpen && modalOpen !== -1) {
      clickToToggleMenu();
    }
  }, [modalOpen, isOpen, clickToToggleMenu]); // it's ok to remove this dependency array, and let it run on each render.

  return (
    <FocusTrap active={modalOpen !== -1 || isOpen}>
      <div>
        <div
          onClick={handleOverlayClick}
          className={`${styles.overlay} ${
            modalOpen !== -1
              ? styles.backdropDesktop
              : isOpen
              ? styles.backdrop
              : ""
          }`}
        ></div>
        {modalOpen === 0 && <ProfileModal />}
        {modalOpen === 1 && <Modal>Notifications menu</Modal>}
        {modalOpen === 2 && <Modal>Search menu</Modal>}
        <aside
          ref={asideRef}
          className={`${styles.aside} ${isOpen ? styles.clicked : ""} 
          ${locale === "en" ? styles.asideLtr : ""}`}
          onClick={() => setModalOpen(-1)}
        >
          <Header
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
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
