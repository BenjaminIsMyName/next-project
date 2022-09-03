import jwt_decode from "jwt-decode";
import { useEffect } from "react";

export default function useGoogle() {
  function handleGoogleLogin(response) {
    console.log(`All info from google`, response);
    console.log(`Client ID (Global in app): ${response.clientId}`);
    console.log(`Encoded JWT ID token:`, response.credential);
    let userObject = jwt_decode(response.credential);
    console.log(`userObject`, userObject);
    console.log("ID: " + userObject.sub);
    console.log("Full Name: " + userObject.name);
    console.log("Given Name: " + userObject.given_name);
    console.log("Family Name: " + userObject.family_name);
    console.log("Image URL: " + userObject.picture);
    console.log("Email: " + userObject.email);
  }

  useEffect(() => {
    window.google?.accounts?.id?.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
    });
  }, []);
}
