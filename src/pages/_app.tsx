import type { AppProps } from 'next/app'
import React from 'react'
import '@/styles/globals.css'

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { Authenticator } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import { NextIntlProvider } from 'next-intl'

import awsExports from '@/aws-exports'

Amplify.configure(awsExports)

export default function App({ Component, pageProps }: AppProps) {
  const client = new ApolloClient({
    uri: '/api/graphql',
    cache: new InMemoryCache(),
  })

  return (
    <ApolloProvider client={client}>
      <NextIntlProvider messages={pageProps.messages}>
        <Authenticator.Provider>
          <Component {...pageProps} />
        </Authenticator.Provider>
      </NextIntlProvider>
    </ApolloProvider>
  )
}
