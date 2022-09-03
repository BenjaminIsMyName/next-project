import "../styles/globals.css";
import { wrapper } from "../store/store";
import Rest from "../components/Rest";
import Aside from "../components/aside/Aside";
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import { getCookie, setCookie } from "cookies-next";
import { StyledEngineProvider } from "@mui/material/styles";
import { dark } from "../context/mui-theme";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import cacheRtl from "../context/mui-rtl";
import { useRouter } from "next/router";
import { appWithTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { LangContext } from "../context/LangContext";
import GooglePrompt from "../components/GooglePrompt";
import useGoogle from "../hooks/useGoogle";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { locale } = router;

  // on client side only:
  if (typeof window !== "undefined") {
    document.body.dir = locale === "en-US" ? "ltr" : "rtl";
    document.querySelector("html").dir = locale === "en-US" ? "ltr" : "rtl";
  }

  // We need to know the language across the entire app.
  const [language, setLanguage] = useState(locale);
  useGoogle();
  return (
    <LangContext.Provider value={{ language, setLanguage }}>
      <CacheProvider value={cacheRtl}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={dark}>
            {/* injectFirst is needed to override the css of MUI without using "!important", see docs: https://mui.com/material-ui/guides/interoperability/#css-injection-order-3 */}
            <Aside />
            <Rest>
              <GooglePrompt locale={locale} />
              <Component {...pageProps} />
            </Rest>
          </ThemeProvider>
        </StyledEngineProvider>
      </CacheProvider>
    </LangContext.Provider>
  );
}

export default appWithTranslation(wrapper.withRedux(MyApp));
