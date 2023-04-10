import { useEffect } from "react";
import axios from "axios";

const isCurrentlyPWA =
  typeof window !== "undefined" &&
  matchMedia("(display-mode: standalone)").matches;

async function isInstalled() {
  // check if browser version supports the api
  console.log("at isInstalled() function");
  if ("getInstalledRelatedApps" in window.navigator) {
    console.log("getInstalledRelatedApps is indeed in window.navigator");
    const relatedApps = await navigator.getInstalledRelatedApps();
    console.log("relatedApps: ", relatedApps);
    relatedApps.forEach(app => {
      // if redilet PWA exists in the array it is installed
      console.log("app.platform:", app.platform, "app.url:", app.url);
    });

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
            how: on initial load / user state change - check isPWAinstalled and if true re-set the cookies. 

        2. When PWA is not installed - update the cookies to expire as session cookies (on initial load / user state change).

    */

  useEffect(() => {
    console.log("usePWA useEffect");
    console.log("isPWA", isCurrentlyPWA);
    console.log("user?.id", user?.id);

    async function reSetCookies() {
      console.log("reSetCookies");
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
