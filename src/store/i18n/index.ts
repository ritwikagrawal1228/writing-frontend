import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import i18next from 'i18next'

export type Lang = 'en' | 'ja'

export type LangState = {
  lang: Lang
}

export type UpdateLangPayload = Lang

const initialState: LangState = {
  lang: (localStorage.getItem('lang') as Lang) || ('ja' as Lang),
}

export const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    updateLang(state, action: PayloadAction<UpdateLangPayload>) {
      state.lang = action.payload
      localStorage.setItem('lang', action.payload)
      i18next.changeLanguage(state.lang)
    },
    reset(): LangState {
      return initialState
    },
  },
})
