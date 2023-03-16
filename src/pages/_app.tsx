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
import { AbstractIntlMessages, NextIntlProvider } from 'next-intl'
import { DefaultSeo } from 'next-seo'
import NProgress from 'nprogress'
import { ErrorBoundary } from 'react-error-boundary'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import Page500 from './500'

import awsExports from '@/aws-exports'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { ColorModeContext } from '@/context/ColorMode'
import { useStore } from '@/store'
import { getDesignTokens } from '@/themes/defaultTheme'
import { onError } from '@/utils/onError'

Amplify.configure(awsExports)

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

type PageProps = {
  messages: AbstractIntlMessages
  now: number
}

type Props = Omit<AppProps<PageProps>, 'pageProps'> & {
  pageProps: PageProps
}

export default function App({ Component, pageProps }: Props) {
  const store = useStore()
  const persistor = persistStore(store)
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
        {/* eslint-disable  */}
        {/* // @ts-nocheck */}
        <NextIntlProvider messages={pageProps.messages}>
          <Authenticator.Provider>
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <ErrorBoundary FallbackComponent={Page500} onError={onError}>
                  <GoogleAnalytics />
                  <DefaultSeo
                    defaultTitle="IELTS Writing Helper | IELTSライティング学習効率化アプリ"
                    canonical="https://ielts-writing-helper.com"
                    description="IELTS Writing HelperはIELTSライティングの学習を効率的にするためのWebアプリです。IELTSライティングの問題を作成し、回答を保存、レビューができます。また、AIがあなたの回答をレビューし、スコアアップのためのアドバイスしてくれます。"
                    twitter={{
                      handle: '@ieltswritingapp',
                      site: '@ieltswritingapp',
                      cardType: 'summary_large_image',
                    }}
                    openGraph={{
                      type: 'website',
                      title:
                        'IELTS Writing Helper | IELTSライティング学習効率化アプリ',
                      description:
                        'IELTS Writing HelperはIELTSライティングの学習を効率的にするためのWebアプリです。IELTSライティングの問題を作成し、回答を保存、レビューができます。また、AIがあなたの回答をレビューし、スコアアップのためのアドバイスしてくれます。',
                      site_name: 'IELTS Writing Helper',
                      url: 'https://ielts-writing-helper.com',
                      images: [
                        {
                          url: 'https://ielts-writing-helper.com/ogp.png',
                          width: 800,
                          height: 600,
                          alt: 'IELTS Writing Helper | IELTSライティング学習効率化アプリ',
                        },
                      ],
                    }}
                  />
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
