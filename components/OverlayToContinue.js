import styles from "./OverlayToContinue.module.css";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import Link from "next/link";
import FocusTrap from "focus-trap-react";
import Input from "./Input";
import { passwordError } from "../util/validate";
import { useState } from "react";
import useLogout from "../hooks/useLogout";
import { deleteCookie, getCookie } from "cookies-next";
export default function OverlayToContinue({ onSuccess }) {
  const { user, setUser } = useContext(UserContext);

  const [email, setEmail] = useState(user?.email);
  console.log(`email is ${email}`);

  const logoutFunc = useLogout();

  useEffect(() => {
    document.body.classList.add("no-scroll-in-any-screen");
    async function removeCookies() {
      await logoutFunc();
    }
    removeCookies();
    return () => document.body.classList.remove("no-scroll-in-any-screen");
  }, [logoutFunc]); // aka [] I guess...

  async function handleLogout() {
    setUser(null); // only this, because all cookies were already removed when this component was mounted, in removeCookies()
  }

  const [password, setPassword] = useState("");

  return (
    <FocusTrap active={true}>
      {/* for some reason, this works even when the focus trap in <Aside/> is active. perfect. */}
      {/* warning: without this focus trap here, we won't be able to click anything here while the menu is open, because of the focus trap there */}
      <div className={`${styles.overlay}`}>
        <div className={`${styles.containerInsideOverlay}`}>
          <Input
            checkErrorCallback={passwordError}
            errorText={
              "סיסמה חייבת להיות לפחות 6 תווים, עם מספרים ואותיות לועזיות"
            }
            valueObj={{ password }}
            onChange={e => setPassword(e.target.value)}
            type='password'
            name='password'
            placeholder='סיסמה'
          />
          <button onClick={() => console.log(`password is ${password}`)}>
            Continue
          </button>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </div>
    </FocusTrap>
  );
}
