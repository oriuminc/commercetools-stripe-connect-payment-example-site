import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useApi } from "../hooks/useApi";
import { CURRENCIES } from "../utils";

export const fetchLanguages = createAsyncThunk(
  "locale/fetchLanguages",
  async () => {
    const { getLanguages } = useApi();
    return await getLanguages();
  }
);

const localeSlice = createSlice({
  name: "locale",
  initialState: {
    locale: "en-US",
    currency: "USD",
    availableLanguages: [{ locale: "en-US", name: "English (United States)" }],
  },
  reducers: {
    setLocale: (state, action) => {
      state.locale = action.payload;
    },
    updateAvailableLanguages: (state) => {
      const languageName = new Intl.DisplayNames(state.locale, {
        type: "language",
      });
      const availableLanguages = state.availableLanguages.map(
        (lang) => lang.locale
      );
      state.availableLanguages = [];

      for (const lang of availableLanguages) {
        state.availableLanguages.push({
          locale: lang,
          name: languageName.of(lang),
        });
      }
    },
    setCurrency: (state, action) => {
      const updatedCurrency = CURRENCIES[action.payload];

      if (updatedCurrency !== undefined) state.currency = updatedCurrency;
      else state.currency = CURRENCIES["US"];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLanguages.fulfilled, (state, action) => {
      const languageName = new Intl.DisplayNames(state.locale, {
        type: "language",
      });
      state.availableLanguages = [];

      for (const lang of action.payload) {
        state.availableLanguages.push({
          locale: lang,
          name: languageName.of(lang),
        });
      }
    });
  },
});

export const { setCurrency, setLocale, updateAvailableLanguages } =
  localeSlice.actions;
export default localeSlice.reducer;
