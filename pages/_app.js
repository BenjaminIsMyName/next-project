import "../styles/globals.css";
import { wrapper } from "../store/store";
import Rest from "../components/Rest";
import Aside from "../components/aside/Aside";
import { setUser } from "../store/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { getCookie, setCookie } from "cookies-next";
import { StyledEngineProvider } from "@mui/material/styles";
import { dark } from "../context/mui-theme";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import cacheRtl from "../context/mui-rtl";
import { useRouter } from "next/router";

import { useTranslation, appWithTranslation } from "next-i18next";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { locale } = router;

  const { i18n } = useTranslation();
  const lang = getCookie("lang");
  const dispatch = useDispatch();
  if (typeof window !== "undefined") {
    document.body.dir = locale === "en-US" ? "ltr" : "rtl";
    document.querySelector("html").dir = locale === "en-US" ? "ltr" : "rtl";
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
    // let user = getCookie("user");

    // TODO: uncomment thoese lines
    // if (user) {
    //   user = JSON.parse(user);
    //   const loggedInUntil = new Date(user.loggedInUntil);

    //   if (loggedInUntil > new Date()) dispatch(setUser(user));
    // }
  }

  useEffect(() => {
    setCookie("lang", locale);
  }, [locale]);

  console.log(`locale is ${locale}`);

  return (
    <CacheProvider value={cacheRtl}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={dark}>
          {/* injectFirst is needed to override the css of MUI without using "!important", see docs: https://mui.com/material-ui/guides/interoperability/#css-injection-order-3 */}
          <Aside />
          <Rest>
            <Component {...pageProps} />
          </Rest>
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  );
}

export default appWithTranslation(wrapper.withRedux(MyApp));
