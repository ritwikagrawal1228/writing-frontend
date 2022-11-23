/** colors defines the colors to be used throughout the project */
const colors = {
  primary: {
    main: '#e31837',
    dark: '#9e1026',
    light: '#e8465f',
  },
  secondary: {
    main: '#fff',
    dark: '#b2b2b2',
    light: '#fff',
  },
  warning: {
    main: '#D32F2F',
    light: '#FBEAEA',
  },
  base: {
    black: '#202124',
    gray: '#353F43',
    lightGray: '#7c7c7c',
    white: '#FFFFFF',
  },
  link: {
    text: '#327CBF',
  },
  component: {
    listSelected: '#E9F1FF',
    iconSelected: '#F2F6FD',
    overLay: '#00000026',
    scrim: '#0000007F',
    tooltip: 'rgba(97, 97, 97, 0.94)',
  },
  border: {
    main: '#C7C7C7',
    light: '#EAEAEA',
  },
  disabled: {
    main: '#BEBBB5',
    light: '#EDEDED',
  },
  bg: {
    highlighted: '#F6F7F9',
    columnTitle: '#EEEEEE',
  },
  table: {
    head: '#EDEBE8',
  },
} as const

/** elevations defines the shadows density to be used throughout the project */
const elevations = {
  s: 2,
  m: 4,
  l: 5,
  xl: 13,
} as const

/** fontSize defines the font sizes to be used throughout the project */
const fontSizes = {
  xxxl: '32px',
  xxl: '24px',
  xl: '20px',
  l: '18px',
  m: '16px',
  s: '14px',
  xs: '12px',
  xxs: '10px',
} as const

/** spaces defines the spaces to be used throughout the project */
const spaces = {
  xxxs: '4px',
  xxs: '8px',
  xs: '12px',
  s: '16px',
  m: '20px',
  l: '24px',
  xl: '28px',
  xxl: '32px',
  xxxl: '36px',
  xxxxl: '40px',
} as const

const formControlMinWidth = {
  xxxs: '50px',
  xxs: '75px',
  xs: '88px',
  s: '148px',
  m: '320px',
} as const

const snackBarWidth = {
  m: '320px',
} as const

const inputHeight = {
  default: 40,
}

const pages = {
  master: {
    create: {
      contentFullWidth: { md: '1000px' },
      contentHalfWidth: { md: '500px' },
    },
  },
  transaction: {
    contentFullWidth: { md: '1732px' },
  },
}

const tableStyles = {
  size: {
    maxHeight: '380px',
    minHeight: '104px',
  },
}

export {
  colors,
  elevations,
  spaces,
  fontSizes,
  formControlMinWidth,
  snackBarWidth,
  inputHeight,
  pages,
  tableStyles,
}
