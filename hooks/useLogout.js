import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { deleteCookie } from "cookies-next";
import axios from "axios";
export default function useLogout() {
  async function logout() {
    try {
      await axios.delete("/api/logout");
    } catch (err) {
      console.log(err);
      deleteCookie("user");
    }
  }

  return logout;
}
