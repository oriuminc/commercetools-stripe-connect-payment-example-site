import { configureStore } from "@reduxjs/toolkit";
import localeSlice from "./localeSlice";

const store = configureStore({
  reducer: {
    language: localeSlice,
  },
});

export default store;
