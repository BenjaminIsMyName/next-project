import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import menu from "./menuSlice";
import user from "./userSlice";
const combinedReducers = combineReducers({
  menu,
  user,
});

export const makeStore = () => {
  return configureStore({
    reducer: combinedReducers,
  });
};

export const wrapper = createWrapper(makeStore);
