import { createSlice } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next";
const userSlice = createSlice({
  name: "user",
  initialState: getCookie("user") ? JSON.parse(getCookie("user")) : null,
  reducers: {
    setUser: (_state, action) => action.payload,
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
