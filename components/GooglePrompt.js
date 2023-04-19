// import { useEffect, useRef, useState } from "react";
// import { motion as m } from "framer-motion";
// export default function GooglePrompt() {
//   const [show, setShow] = useState(false);
//   const timerRef = useRef(null);

//   useEffect(() => {
//     timerRef.current = setTimeout(() => {
//       setShow(true);
//     }, 3000);

//     return () => {
//       clearTimeout(timerRef.current);
//     };
//   }, []);

//   if (typeof window !== "undefined") {
//     window.localCallback = function () {
//       console.log(`g_id_onload_callback`);
//     };
//   }

//   return (
//     <div
//       id="g_id_onload"
//       data-callback="localCallback"
//       data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
//       data-prompt_parent_id="g_id_onload"
//       className={`fixed top-5 ltr:right-6 rtl:left-9 z-[9999] ${
//         show ? "visible opacity-100" : "invisible opacity-0"
//       } `}
//     >
//       {/* TODO: bug on Chrome, the iframe isn't inside of this div.
//               Causes the prompt to appear on the right even on he-IL. Try to solve this. */}
//     </div>
//   );
// }

// NOTE: when using HTML for the prompt, we don't need the window.google.accounts.id.prompt();
