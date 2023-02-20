import type { AppProps } from 'next/app'
import Router from 'next/router'
import React, { useEffect, useMemo } from 'react'

import '@/styles/globals.css'
import 'nprogress/nprogress.css'

import { Authenticator } from '@aws-amplify/ui-react'
import {
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
} from '@mui/material'
import { Amplify } from 'aws-amplify'
import { NextIntlProvider } from 'next-intl'
import NProgress from 'nprogress'
import { ErrorBoundary } from 'react-error-boundary'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'

import awsExports from '@/aws-exports'

import { PersistGate } from 'redux-persist/integration/react'

import { ColorModeContext } from '@/context/ColorMode'
import { useStore } from '@/store'
import { getDesignTokens } from '@/themes/defaultTheme'
import { onError } from '@/utils/onError'

import Page500 from './500'

Amplify.configure(awsExports)

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const store = useStore()
const persistor = persistStore(store)
export default function App({ Component, pageProps }: AppProps) {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light')
  useEffect(() => {
    setMode(() => {
      const prevMode = localStorage.getItem('theme')
      if (prevMode !== null) {
        return prevMode as PaletteMode
      }

      const machineMode =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'

      localStorage.setItem('theme', machineMode)

      return machineMode
    })
  }, [])

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    [],
  )

  const theme = useMemo(() => {
    return createTheme(getDesignTokens(mode))
  }, [mode])

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NextIntlProvider messages={pageProps.messages}>
          <Authenticator.Provider>
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <ErrorBoundary FallbackComponent={Page500} onError={onError}>
                  <Component {...pageProps} />
                </ErrorBoundary>
              </ThemeProvider>
            </ColorModeContext.Provider>
          </Authenticator.Provider>
        </NextIntlProvider>
      </PersistGate>
    </Provider>
  )
}
