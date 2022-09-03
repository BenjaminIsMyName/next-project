import styles from "./GooglePrompt.module.css";
import { useEffect, useRef, useState } from "react";
import jwt_decode from "jwt-decode";
export default function GooglePrompt({ locale }) {
  const [show, setShow] = useState(false);
  const timeOutRef = useRef();
  // function handleGoogleLogin(response) {
  //   console.log(`Encoded JWT ID token:`, response.credential);
  //   let userObject = jwt_decode(response.credential);
  //   console.log(`userObject`, userObject);
  // }

  // // Allow login with google:
  // useEffect(() => {
  //   /* global google */
  //   window.google?.accounts?.id?.initialize({
  //     client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  //     callback: handleGoogleLogin,
  //   });

  //   // timeOutRef.current = setTimeout(window.google.accounts.id.prompt, 5);
  //   // window.google.accounts.id.prompt();

  //   return () => clearTimeout(timeOutRef.current);
  // }, []);

  return (
    <>
      {/* TODO: bug on Chrome, the iframe isn't inside of this div. 
              Causes the prompt to appear on the right even on he-IL. Try to solve this. */}
      {/* <div
        id='g_id_onload'
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        // data-login_uri='https://your.domain/your_login_endpoint'
        data-prompt_parent_id='g_id_onload'
        className={styles.promptContainer}
        style={{
          visibility: show ? "visible" : "hidden",
          opacity: show ? 1 : 0,
          left: locale === "he-IL" ? "20px" : "unset",
          right: locale === "en-US" ? "20px" : "unset",
        }}
      ></div> */}
    </>
  );
}
