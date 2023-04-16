import FocusTrap from "focus-trap-react";
import { motion as m } from "framer-motion";
import { useRouter } from "next/router";

export default function Container({
  children,
  shouldAnimateIn,
  shouldAnimateOut,
}) {
  const { locale } = useRouter();
  return (
    <FocusTrap focusTrapOptions={{ allowOutsideClick: true }}>
      {/* don't allow tabs outside of here, but allow clicks on the menu  */}
      <m.div
        initial={shouldAnimateIn ? { scale: 0, rotate: 0, opacity: 0 } : {}}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={shouldAnimateOut ? { scale: 0, rotate: 0, opacity: 0 } : {}}
        // cubic-bezier(.17,.67,.14,.9) - fast at the beginning, slow at the end
        transition={{ ease: [0.17, 0.67, 0.14, 0.9], duration: 1 }}
        className={`absolute top-0 left-0 right-0 min-h-[1000px] text-option-text-color 
        bg-second-color/80 z-20 backdrop-blur-md border-b-[20px] border-main-color
        pb-[var(--header-height)] md:pb-0 p-[min(20px,3%)] md:p-5 md:border-[20px] border-0 
       ${
         locale === "en" // all of this is needed only when the post is fixed on the feed
           ? "md:left-[var(--aside-width)]"
           : "md:right-[var(--aside-width)]"
       } `}
      >
        {children}
      </m.div>
    </FocusTrap>
  );
}
