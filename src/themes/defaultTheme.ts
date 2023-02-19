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
    background: {
      default: mode === 'dark' ? '' : colors.bg.highlighted,
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
    fontSize: 16,
    button: {
      textTransform: 'none',
    },
  },
  components: {
    /** Common style for OutlinedInput component  */
    MuiOutlinedInput: {
      defaultProps: {
        color: 'secondary',
      },
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
    MuiTextField: {
      defaultProps: {
        color: 'secondary',
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
    },
    MuiRadio: {
      defaultProps: {
        color: 'secondary',
      },
    },
  },
})
