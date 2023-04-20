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
  const userRef = useRef(); // to make sure the user is up-to-date when the timeout runs
  userRef.current = user;
  useEffect(() => {
    //  run only on initial page load, don't show the prompt again when user is logging out!
    renderCount.current++;
    if (renderCount.current > 1) {
      return;
    }
    if (userRef.current) return; // it doesn't matter here if we use user or userRef.current. they are the same here. the useEffect will run again when user changes...
    try {
      setTimeout(() => {
        if (userRef.current) return; // we can't use user here because it's not up-to-date when the timeout runs, but userRef.current is because it's a ref (a pointer to the value)
        window.google.accounts.id.prompt(); // display the One Tap dialog
      }, 7000);
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
