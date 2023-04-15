import FocusTrap from "focus-trap-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Modal from "../Modal.js";
import Header from "./Header.js";
import Option from "./Option.js";
import ProfileModal from "./profileModal/ProfileModal";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useMedia } from "react-use";
import ForYouIcon from "../icons/ForYouIcon";
import PopularIcon from "../icons/PopularIcon";
import TopicsIcon from "../icons/TopicsIcon.js";
import SavedIcon from "../icons/SavedIcon.js";
import PolicyIcon from "../icons/PolicyIcon.js";

export default function Aside() {
  const { t } = useTranslation("menu");
  const { locale } = useRouter();
  const asideRef = useRef(); // used on the <aside> tag, to scroll back up when opening and closing the menu.
  const [isOpen, setIsOpen] = useState(false); // is the <aside> open, on mobile
  const [modalOpen, setModalOpen] = useState(-1); // is a little menu open? (none: -1, profile menu: 0)

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

  useEffect(() => {
    // when navigating to a different page
    return () => document.body.classList.remove("no-scroll");
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

  const isMobile = useMedia("(max-width: 900px)", true);

  return (
    <FocusTrap
      active={modalOpen !== -1 || (isOpen && isMobile)} // the "isMobile" is needed because if it doesn't exist, there will be a bug: open menu on mobile, make it wider, try to open post / like. You can't. You are still locked in the menu...
      focusTrapOptions={{
        escapeDeactivates: true, // default
        onDeactivate: () => {
          // onDeactivate is necessary, and if you think everything is working fine without it, try restarting the development server and try again
          setModalOpen(-1);
          setIsOpen(false);
          document.body.classList.remove("no-scroll"); // this is needed because if it doesn't exist, there will be a bug: open menu on mobile, make it wider, and go back to mobile. You cannot scroll, but menu is closed... because of line above "setIsOpen(false)"
        },
      }}
    >
      <div id="containerOfAsideAndOverlay">
        {/* A focus-trap cannot use a Fragment as its child container, that's why this div exist */}
        <div
          id="overlay"
          onClick={handleOverlayClick}
          className={`opacity-0 transition-[opacity] duration-500 ${
            modalOpen !== -1
              ? "fixed z-[1] top-0 left-0 w-full h-full"
              : isOpen
              ? `opacity-100 fixed z-[1] top-0 left-0 w-full h-full bg-shadows-color bg-opacity-50 backdrop-blur-md md:hidden`
              : ""
          }`}
        ></div>
        {modalOpen === 0 && (
          <ProfileModal closeModals={() => setModalOpen(-1)} />
        )}
        {modalOpen === 1 && <Modal>Notifications menu</Modal>}
        {modalOpen === 2 && <Modal>Search menu</Modal>}
        <aside
          ref={asideRef}
          className={`select-none bg-second-color h-[var(--header-height)] bottom-0
                      fixed z-[1] scroll-smooth transition-all w-full 
                      md:h-screen md:w-[300px] 
          ${
            isOpen
              ? "duration-500 bottom-0 overflow-auto h-64 max-h-screen"
              : ""
          } 
          ${
            locale === "en"
              ? "shadow-[3px_0_5px_2px_rgba(var(--shadows-color),_0.5)]"
              : "shadow-[-3px_0_5px_2px_rgba(var(--shadows-color),_0.5)]"
          }`}
          onClick={() => setModalOpen(-1)}
        >
          <Header
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            menuOnClickHandler={clickToToggleMenu}
            isOpen={isOpen}
          />
          <Option
            onClick={() => setIsOpen(false)}
            text={t("for-you")}
            link="/"
            icon={() => ForYouIcon}
          />
          <Option
            onClick={() => setIsOpen(false)}
            text={t("popular")}
            link="/popular"
            icon={() => PopularIcon}
          />
          <Option
            onClick={() => setIsOpen(false)}
            text={t("topics")}
            link="/topics"
            icon={() => TopicsIcon}
          />

          <Option
            onClick={() => setIsOpen(false)}
            text={t("saved")}
            link="/saved"
            icon={() => SavedIcon}
          />
          <Option
            onClick={() => setIsOpen(false)}
            text={t("privacy-policy")}
            link={process.env.NEXT_PUBLIC_SITE_URL + "/policy.md"}
            icon={() => PolicyIcon}
            newTab={true}
          />
        </aside>
      </div>
    </FocusTrap>
  );
}
