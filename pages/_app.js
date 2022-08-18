import "../styles/globals.css";
import { wrapper } from "../store/store";
import Rest from "../components/Rest";
import Aside from "../components/aside/Aside";
import { setUser } from "../store/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { getCookie } from "cookies-next";
function MyApp({ Component, pageProps }) {
  const dispatch = useDispatch();
  if (typeof window !== "undefined") {
    // const fromLocalStorage = localStorage.getItem("loggedInUntil");
    // if (fromLocalStorage !== null) {
    //   const loggedInUntil = new Date(
    //     JSON.parse(localStorage.getItem("loggedInUntil"))
    //   );
    //   const name = localStorage.getItem("name");
    //   if (loggedInUntil > new Date())
    //     dispatch(
    //       setUser({ name, loggedInUntil: JSON.stringify(loggedInUntil) })
    //     );
    // }
    let user = getCookie("user");

    if (user) {
      user = JSON.parse(user);
      const loggedInUntil = new Date(user.loggedInUntil);
      if (loggedInUntil > new Date()) dispatch(setUser(user));
    }
  }
  return (
    <>
      <Aside />
      <Rest>
        <Component {...pageProps} />
      </Rest>
    </>
  );
}

export default wrapper.withRedux(MyApp);
