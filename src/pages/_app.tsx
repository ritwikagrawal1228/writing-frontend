import type { AppProps } from 'next/app'
import React from 'react'
import '@/styles/globals.css'

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { Authenticator } from '@aws-amplify/ui-react'
import { createTheme, Theme, ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { Amplify } from 'aws-amplify'
import { NextIntlProvider } from 'next-intl'

import awsExports from '@/aws-exports'
import { defaultTheme } from '@/themes/defaultTheme'

Amplify.configure(awsExports)

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
          <Authenticator.Provider>
            <Component {...pageProps} />
          </Authenticator.Provider>
        </ThemeProvider>
      </NextIntlProvider>
    </ApolloProvider>
  )
}
