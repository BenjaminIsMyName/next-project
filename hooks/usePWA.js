import { useEffect } from "react";
import axios from "axios";

const isCurrentlyPWA =
  typeof window !== "undefined" &&
  matchMedia("(display-mode: standalone)").matches;

async function isInstalled() {
  // check if browser version supports the api
  if ("getInstalledRelatedApps" in window.navigator) {
    const relatedApps = await navigator.getInstalledRelatedApps();
    // as of 2023, detecting PWA works only on Android, Chrome 84 or later: https://web.dev/get-installed-related-apps/#supported-app-types-you-can-check
    // see also: https://caniuse.com/mdn-api_navigator_getinstalledrelatedapps
    return relatedApps.some(
      app =>
        app.platform === "webapp" &&
        app.url === "https://redilet.com/manifest.json"
    );
  }
}

export default function usePWA(user) {
  /* 

      What do we want?
        1. When PWA is installed (in general) - update the cookies to expire in 1 year (on initial load / user state change).
        2. When PWA is not installed - update the cookies to expire as session cookies (on initial load / user state change).

    */

  useEffect(() => {
    async function reSetCookies() {
      try {
        const isPWAinstalled = await isInstalled();
        if (user?.id) {
          await axios.put("/api/re-set-cookies", {
            isPWA: isCurrentlyPWA || isPWAinstalled,
          });
        }
      } catch (err) {
        console.log("err", err);
      }
    }
    reSetCookies();
  }, [user?.id]);
}
