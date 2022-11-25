import type { AppProps } from 'next/app'
import React, { useEffect, useMemo } from 'react'
import '@/styles/globals.css'

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { Authenticator } from '@aws-amplify/ui-react'
import { createTheme, PaletteMode, ThemeProvider } from '@mui/material'
import { Amplify } from 'aws-amplify'
import { NextIntlProvider } from 'next-intl'

import awsExports from '@/aws-exports'
import { ColorModeContext } from '@/context/ColorMode'
import { getDesignTokens } from '@/themes/defaultTheme'

Amplify.configure(awsExports)

export default function App({ Component, pageProps }: AppProps) {
  const client = new ApolloClient({
    uri: '/api/graphql',
    cache: new InMemoryCache(),
  })
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
    <ApolloProvider client={client}>
      <NextIntlProvider messages={pageProps.messages}>
        <Authenticator.Provider>
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              <Component {...pageProps} />
            </ThemeProvider>
          </ColorModeContext.Provider>
        </Authenticator.Provider>
      </NextIntlProvider>
    </ApolloProvider>
  )
}
