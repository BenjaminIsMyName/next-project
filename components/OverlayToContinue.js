import styles from "./OverlayToContinue.module.css";
import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";
import Link from "next/link";
import FocusTrap from "focus-trap-react";
import Input from "./Input";
import { passwordError } from "../util/validate";
import { useState } from "react";
import useLogout from "../hooks/useLogout";
import { deleteCookie, getCookie } from "cookies-next";
import useLogin from "../hooks/useLogin";
import { useTranslation } from "next-i18next";
import Button from "./Button";
import Loading from "./Loading";
export default function OverlayToContinue({ onSuccess }) {
  const { user, setUser } = useContext(UserContext);
  const [errorText, setErrorText] = useState("");
  const email = useRef(user?.email);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("menu");
  const logoutFunc = useLogout();

  useEffect(() => {
    document.body.classList.add("no-scroll-in-any-screen");
    logoutFunc(); // will be called twice, due to strict mode
    return () => document.body.classList.remove("no-scroll-in-any-screen");
  }, [logoutFunc]); // same as []... because I used useCallback in useLogout

  async function handleLogout() {
    setUser(null); // only this, because all cookies were already removed when this component was mounted, in useEffect()
  }

  const loginFunc = useLogin();

  async function handleLogin() {
    setLoading(true);
    const { errorTextPassword, success } = await loginFunc(
      email.current,
      password
    );
    setLoading(false);
    if (success) {
      onSuccess();
    } else {
      setErrorText(errorTextPassword);
    }
  }

  return (
    <FocusTrap
      active={true}
      focusTrapOptions={{
        escapeDeactivates: false,
      }}
    >
      {/* for some reason, this works even when the focus trap in <Aside/> is active. perfect. */}
      {/* warning: without this focus trap here, we won't be able to click anything here while the menu is open, because of the focus trap there */}
      <div className={`${styles.overlay}`}>
        <div className={`${styles.containerInsideOverlay}`}>
          <Input
            checkErrorCallback={passwordError}
            valueObj={{ password }}
            onChange={e => setPassword(e.target.value)}
            type="password"
            name="password"
            placeholder={t("inputs.password")}
          />
          <Button
            disabled={passwordError(password) || loading}
            onClick={handleLogin}
          >
            {t("actions.continue")}
          </Button>
          <div className={styles.loadingAndErrorContainer}>
            {loading && <Loading width="50px" height="50px" padding="0" />}
            {loading || <span>{errorText}</span>}
          </div>

          <Button type="button" onClick={handleLogout}>
            {t("actions.logout")}
          </Button>
        </div>
      </div>
    </FocusTrap>
  );
}
