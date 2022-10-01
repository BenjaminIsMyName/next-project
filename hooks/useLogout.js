import { useCallback } from "react";
import { deleteCookie } from "cookies-next";
import axios from "axios";
export default function useLogout() {
  const logout = useCallback(async () => {
    try {
      await axios.delete("/api/logout");
    } catch (err) {
      console.log(err);
      deleteCookie("user");
    }
  }, []);

  return logout;
}
