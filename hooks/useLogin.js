import axios from "axios";
import { useState } from "react";
import { getCookie } from "cookies-next";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useTranslation } from "next-i18next";
export default function useLogout() {
  const { t } = useTranslation("menu");
  const { setUser } = useContext(UserContext);
  const errorsText = {
    wrongPassword: t("error-text.wrong-password"),
    general: t("error-text.general"),
  };

  async function login(email, password) {
    try {
      await axios.post("/api/login", {
        email,
        password,
      });
      const userCookie = getCookie("user");
      setUser(JSON.parse(userCookie));
      return { success: true };
    } catch (err) {
      if (err?.response?.data?.error === "wrong password") {
        console.log(`wrong password`);
        return { errorTextPassword: errorsText.wrongPassword };
      } else {
        console.log("Error", err.message);
        return { errorTextPassword: errorsText.general };
      }
    }
  }

  return login;
}
