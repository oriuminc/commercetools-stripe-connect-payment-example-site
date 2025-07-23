import { configureStore } from "@reduxjs/toolkit";
import localeSlice from "./localeSlice";
import customerSlice from "./customerSlice";

const store = configureStore({
  reducer: {
    locale: localeSlice,
    customer: customerSlice,
  },
});

export default store;
