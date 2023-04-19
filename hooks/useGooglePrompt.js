import { useRouter } from "next/router";
import { useContext, useEffect, useRef } from "react";
import { AlertContext } from "../context/AlertContext";
import { useTranslation } from "next-i18next";

export default function useGooglePrompt({
  googleStatus,
  googleError,
  GoogleStatusEnum,
  user,
  errorsText,
  googleLoginMethod,
  GoogleLoginMethodsEnum,
  add,
}) {
  const router = useRouter();
  const { locale } = router;
  const renderCount = useRef(0);
  const { t } = useTranslation(["menu", "common"]);
  useEffect(() => {
    //  run only on initial page load, don't show the prompt again when user is logging out!
    renderCount.current++;
    if (renderCount.current > 1) {
      return;
    }
    if (user) return;
    try {
      setTimeout(() => {
        window.google.accounts.id.prompt(); // display the One Tap dialog
      }, 2000);
    } catch (error) {
      console.log(`error 2 in useGoogle hook`, error);
    }
  }, [locale, user]);

  useEffect(() => {
    if (googleLoginMethod !== GoogleLoginMethodsEnum.prompt) {
      return;
    }
    if (googleStatus === GoogleStatusEnum.loading) {
      add({
        title:
          t("loading", {
            ns: "common",
          }) + "...",
        color: "success",
      });
    } else if (googleStatus === GoogleStatusEnum.error) {
      if (googleError.statusCode === 409) {
        add({
          title: errorsText.tryWithPassword,
        });
      } else {
        add({
          title: errorsText.general,
        });
      }
    } else if (googleStatus === GoogleStatusEnum.success) {
      add({
        title: t("titles.welcome") + ", " + user.name,
        color: "success",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleStatus]); // run only when googleStatus changes. not when other values change. otherwise we will be overflown with alerts
}
