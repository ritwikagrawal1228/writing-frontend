import { PaletteMode } from '@mui/material'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type colorModeState = {
  colorMode: PaletteMode
}

export type UpdateLangPayload = PaletteMode

const initialState: colorModeState = {
  colorMode:
    (localStorage.getItem('theme') as PaletteMode) || window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : ('light' as PaletteMode),
}

export const colorModeSlice = createSlice({
  name: 'colorMode',
  initialState,
  reducers: {
    updateColorMode(state, action: PayloadAction<UpdateLangPayload>) {
      state.colorMode = action.payload
      localStorage.setItem('theme', action.payload)
    },
    reset(): colorModeState {
      return initialState
    },
  },
})
