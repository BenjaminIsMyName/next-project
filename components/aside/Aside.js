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

export default function Aside({ modalOpen, setModalOpen }) {
  const { t } = useTranslation("menu");
  const { locale } = useRouter();
  const asideRef = useRef(); // used on the <aside> tag, to scroll back up when opening and closing the menu.
  const [isOpen, setIsOpen] = useState(false); // is the <aside> open, on mobile

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

  function handleOverlayClick(e) {
    if (!shouldClose(e)) return;
    if (modalOpen !== -1 && isOpen) {
      // if a little menu is open, and the big menu is open, close both
      clickToToggleMenu();
      setModalOpen(-1);
    } else if (isOpen) {
      // if the big menu is open, close it
      clickToToggleMenu();
    } else {
      // if a little menu is open, close it
      setModalOpen(-1);
    }
  }

  function shouldClose(e) {
    // if you click on an element that has (or its parent/grandparent has) the attribute "data-should-not-close-little-or-big-menu", it won't close the menu
    const found = e.target.closest(
      "[data-should-not-close-little-or-big-menu]"
    );
    return found ? false : true;
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
      <div
        data-short-description="containerOfAsideAndOverlay"
        data-description="this is the container of the aside and the overlay. It's needed because the focus-trap cannot use a Fragment as its child container"
      >
        {/* A focus-trap cannot use a Fragment as its child container, that's why this div exist */}
        <div
          data-short-description="overlay"
          data-description="this is the overlay that is on the page when the menu/modal is open"
          onClick={handleOverlayClick}
          className={`opacity-0 transition-[opacity] duration-500 ${
            modalOpen !== -1 // if modal is open, the overlay is not visible, but it's still there, so clicking on it will close modal
              ? "fixed z-[1] top-0 left-0 w-full h-full"
              : isOpen // if menu is open, the overlay is visible
              ? `opacity-100 fixed z-[1] top-0 left-0 w-full h-full bg-shadows-color bg-opacity-50 backdrop-blur-md md:hidden`
              : ""
          }`}
        ></div>
        {modalOpen === 0 && (
          <ProfileModal closeModals={() => setModalOpen(-1)} />
        )}
        {/* Currently not being used: */}
        {/* {modalOpen === 1 && <Modal>Notifications menu</Modal>}
        {modalOpen === 2 && <Modal>Search menu</Modal>} */}
        <aside
          ref={asideRef}
          className={`select-none bg-second-color bottom-0
                      fixed z-[1] scroll-smooth transition-all w-full 
                      md:h-screen md:w-[300px] 
          ${
            isOpen
              ? "duration-500 bottom-0 overflow-auto h-[270px] max-h-screen"
              : "h-[var(--header-height)]"
          } 
          ${
            locale === "en"
              ? "shadow-[3px_0_5px_2px_rgba(var(--shadows-color),_0.5)]"
              : "shadow-[-3px_0_5px_2px_rgba(var(--shadows-color),_0.5)]"
          }`}
          onClick={e => {
            if (!shouldClose(e)) return;
            setModalOpen(-1);
          }}
        >
          <Header
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            menuOnClickHandler={clickToToggleMenu}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
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
