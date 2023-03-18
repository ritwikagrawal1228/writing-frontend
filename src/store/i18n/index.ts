import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import i18next from 'i18next'

export type Lang = 'en' | 'ja'

export type LangState = {
  lang: Lang
}

export type UpdateLangPayload = Lang

const initialState: LangState = {
  lang: i18next.language as Lang,
}

export const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    updateLang(state, action: PayloadAction<UpdateLangPayload>) {
      state.lang = action.payload
      i18next.changeLanguage(state.lang)
    },
    reset(): LangState {
      return initialState
    },
  },
})
