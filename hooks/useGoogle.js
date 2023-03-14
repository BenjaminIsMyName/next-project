import jwt_decode from "jwt-decode";
import { useEffect, useRef } from "react";

export default function useGoogle() {
  const callbackRef = useRef(null); // remember which function to call when handleGoogleLogin is called
  function handleGoogleLogin(response) {
    // console.log(`All info from google`, response);
    // console.log(`Client ID (Global in app): ${response.clientId}`);
    // console.log(`Encoded JWT ID token:`, response.credential);
    // let userObject = jwt_decode(response.credential);
    // console.log(`userObject`, userObject);
    // console.log("ID: " + userObject.sub);
    // console.log("Full Name: " + userObject.name);
    // console.log("Given Name: " + userObject.given_name);
    // console.log("Family Name: " + userObject.family_name);
    // console.log("Image URL: " + userObject.picture);
    // console.log("Email: " + userObject.email);
    callbackRef.current.callback(JSON.stringify(response));
  }

  function callCallback(callback) {
    // set the callbackRef
    callbackRef.current = { callback };
  }

  useEffect(() => {
    /* "Warning: The google.accounts.id.initialize method should be called only once,
    even if you use both One Tap and button in the same web page." */
    try {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });
    } catch (error) {
      console.log(`error in useGoogle hook`, error);
    }

    // google.accounts.id.prompt(); // also display the One Tap dialog
  }, []);

  return callCallback;
}
