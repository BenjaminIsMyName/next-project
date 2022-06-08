import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import menu from "./menuSlice";

const combinedReducers = combineReducers({
  menu,
});

export const makeStore = () => {
  return configureStore({
    reducer: combinedReducers,
  });
};

export const wrapper = createWrapper(makeStore);
