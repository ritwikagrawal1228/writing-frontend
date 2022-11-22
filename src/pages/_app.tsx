import type { AppProps } from 'next/app'
import React from 'react'
import '@/styles/globals.css'

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { createTheme, Theme, ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { NextIntlProvider } from 'next-intl'

import { defaultTheme } from '@/themes/defaultTheme'

export const theme: Theme = createTheme(defaultTheme)

export default function App({ Component, pageProps }: AppProps) {
  const client = new ApolloClient({
    uri: '/api/graphql',
    cache: new InMemoryCache(),
  })

  return (
    <ApolloProvider client={client}>
      <CssBaseline />
      <NextIntlProvider messages={pageProps.messages}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </NextIntlProvider>
    </ApolloProvider>
  )
}
