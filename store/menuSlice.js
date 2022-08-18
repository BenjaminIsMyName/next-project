import { createSlice } from "@reduxjs/toolkit";

// const initialState = false;

const menuSlice = createSlice({
  name: "menu",
  initialState: false,
  reducers: {
    toggleMenu: state => !state,
    // setMenu: (state, action) => action.payload,
  },
});

export const { toggleMenu } = menuSlice.actions;
export default menuSlice.reducer;
