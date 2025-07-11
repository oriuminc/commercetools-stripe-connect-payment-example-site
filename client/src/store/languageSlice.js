import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useApi } from "../hooks/useApi";

export const fetchLanguages = createAsyncThunk(
  "language/fetchLanguages",
  async () => {
    const { getLanguages } = useApi();
    console.log("Fetching languages from API...");
    return await getLanguages();
  }
);

const languageSlice = createSlice({
  name: "language",
  initialState: {
    locale: "en-US",
    currency: "USD",
    availableLanguages: [{ code: "en-US", name: "English" }],
    availableCurrencies: [{ USD: ["en-US"] }],
  },
  reducers: {
    setLocale: (state, action) => {
      state.locale = action.payload;
    },
    updateAvailableLanguages: (state) => {
      const languageName = new Intl.DisplayNames(state.locale, {
        type: "language",
      });
      const availableLanguages = state.availableLanguages.map((lang) => lang.code);
      state.availableLanguages = [];
      for (const lang of availableLanguages) {
        state.availableLanguages.push({
          code: lang,
          name: languageName.of(lang),
        });
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLanguages.fulfilled, (state, action) => {
      const languageName = new Intl.DisplayNames(state.locale, {
        type: "language",
      });
      state.availableLanguages = [];
      for (const lang of action.payload) {
        state.availableLanguages.push({
          code: lang,
          name: languageName.of(lang),
        });
      }
    });
  },
});

export const { setLocale, updateAvailableLanguages } = languageSlice.actions;
export default languageSlice.reducer;
