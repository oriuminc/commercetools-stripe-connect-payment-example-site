import { configureStore } from "@reduxjs/toolkit";
import localeSlice from "./localeSlice";

const store = configureStore({
  reducer: {
    locale: localeSlice,
  },
});

export default store;
