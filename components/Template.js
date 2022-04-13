import Aside from "./aside/Aside";
import Rest from "./Rest.js";
import { useState, useRef } from "react";
import LittleMenu from "./LittleMenu";

export default function Template({ children }) {
  const [isOpen, setIsOpen] = useState(false); // is the aside open (on small screens)?
  const [littleMenuOpen, setLittleMenuOpen] = useState(-1); // is a little menu open? (none: -1, profile menu: 0, notifications menu: 1, search menu: 2)
  const asideRef = useRef();
  function menuOnClickHandler() {
    setIsOpen(!isOpen);
    document.body.classList.toggle("no-scroll");
    asideRef.current.theElement.scrollTop = 0;

    // scroll to the top after it's opened a little bit - needed for Chrome, not for Firefox:

    setTimeout(() => {
      asideRef.current.theElement.scrollTop = 0;
    }, 2);

    setTimeout(() => {
      asideRef.current.theElement.scrollTop = 0;
    }, 5);
  }

  return (
    <>
      {littleMenuOpen === 0 && (
        <LittleMenu isBigMenuOpen={isOpen}>Profile menu</LittleMenu>
      )}
      {littleMenuOpen === 1 && (
        <LittleMenu isBigMenuOpen={isOpen}>Notifications menu</LittleMenu>
      )}
      {littleMenuOpen === 2 && (
        <LittleMenu isBigMenuOpen={isOpen}>Search menu</LittleMenu>
      )}
      <Aside
        onClick={littleMenuOpen === -1 ? () => {} : () => setLittleMenuOpen(-1)} // bug: if menu A is open, clicking on menu B do as asked and open menu B (and close A), but then THIS onClick is called and it closes it
        littleMenuOpen={littleMenuOpen}
        setLittleMenuOpen={setLittleMenuOpen}
        menuOnClickHandler={menuOnClickHandler}
        isOpen={isOpen}
        ref={asideRef}
      />
      <Rest
        blur={isOpen}
        menuOnClickHandler={menuOnClickHandler}
        onClick={littleMenuOpen === -1 ? () => {} : () => setLittleMenuOpen(-1)}
      >
        {children}
      </Rest>
    </>
  );
}
