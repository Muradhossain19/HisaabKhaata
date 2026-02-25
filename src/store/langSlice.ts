import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LangState = {
  lang: 'bn' | 'en';
};

import {
  getLang as getStoredLang,
  setLang as persistLang,
} from '../utils/langStorage';

const saved = getStoredLang();
const initialState: LangState = {
  lang: saved === 'en' ? 'en' : 'bn', // default to Bangla unless stored value is 'en'
};

const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<'bn' | 'en'>) {
      state.lang = action.payload;
      try {
        persistLang(action.payload);
      } catch (e) {
        // best-effort persistence; ignore errors
      }
    },
  },
});

export const { setLanguage } = langSlice.actions;
export default langSlice.reducer;
