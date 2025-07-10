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
    language: "en-US",
    currency: "USD",
    availableLanguages: [{ code: "en-US", name: "English" }],
    availableCurrencies: [{ USD: ["en-US"] }],
  },
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLanguages.fulfilled, (state, action) => {
      const languageName = new Intl.DisplayNames(state.language, {
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

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
