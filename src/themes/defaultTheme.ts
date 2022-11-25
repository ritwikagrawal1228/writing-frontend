import { outlinedInputClasses, PaletteMode, ThemeOptions } from '@mui/material'

import { colors, fontSizes } from '@/themes/globalStyles'

export const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    common: {
      black: colors.base.black,
      white: colors.base.white,
    },
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: colors.base.white,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
    },
    warning: {
      main: colors.warning.main,
      light: colors.warning.light,
    },
    info: {
      main: colors.base.black,
    },
    text: {
      primary: mode === 'dark' ? colors.base.white : colors.base.black,
      secondary: mode === 'dark' ? colors.base.white : colors.base.gray,
    },
    action: {
      disabled: colors.disabled.main,
    },
  },
  typography: {
    fontFamily: [
      'Yu Gothic Medium',
      '游ゴシック Medium',
      'YuGothic',
      '游ゴシック体',
      'ヒラギノ角ゴ Pro W3',
      'メイリオ',
      'sans-serif',
    ].join(','),
    fontSize: 16,
  },
  components: {
    /** Common style for OutlinedInput component  */
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderColor: colors.disabled.main,
          fontSize: fontSizes.s,
          [`&.${outlinedInputClasses.disabled}`]: {
            borderColor: colors.disabled.main,
            backgroundColor: colors.disabled.light,
          },
        },
      },
    },
  },
})
