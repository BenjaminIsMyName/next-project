import "../styles/globals.css";
import { wrapper } from "../store/store";
import Rest from "../components/Rest";
import Aside from "../components/aside/Aside";
function MyApp({ Component, pageProps }) {
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
