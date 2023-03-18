import React, { FC, memo, useMemo } from 'react'

import { Box, ThemeProvider, createTheme } from '@mui/material'

import i18next from 'i18next'
import { I18n } from 'aws-amplify'
import { Router } from '@/routes/router'
import {
  Authenticator,
  Button,
  Heading,
  Text,
  View,
  useTheme,
} from '@aws-amplify/ui-react'
import { Path } from '@/constants/Path'
import '@aws-amplify/ui-react/styles.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { dict } from '@/i18n/amplify'
import { langSlice } from '@/store/i18n'
import { getDesignTokens } from '@/themes/defaultTheme'

export const Auth: FC = memo(() => {
  const lang = useSelector((state: RootState) => state.lang.lang)
  const colorMode = useSelector((state: RootState) => state.colorMode.colorMode)
  const dispatch = useDispatch()
  I18n.setLanguage(lang)
  I18n.putVocabularies(dict)
  const switchLang = () => {
    const l = lang === 'ja' ? 'en' : 'ja'
    dispatch(langSlice.actions.updateLang(l))
  }

  const theme = createTheme(getDesignTokens(colorMode))

  return (
    <>
      <Box sx={{ width: '100vw' }}>
        <Authenticator
          initialState="signIn"
          components={{
            Header() {
              const { tokens } = useTheme()
              return (
                <View textAlign="center" padding={tokens.space.large}>
                  <img src="/logo.png" height={40} width={64.72} alt="logo" />
                  <br />
                  <br />
                  <Heading level={3} fontWeight="bold">
                    IELTS Writing Helper
                  </Heading>
                </View>
              )
            },
            Footer() {
              const { tokens } = useTheme()

              return (
                <View textAlign="center" padding={tokens.space.large}>
                  <Button
                    fontWeight="normal"
                    onClick={() => switchLang()}
                    size="small"
                    variation="link"
                  >
                    {lang === 'ja' ? 'English' : '日本語'}
                  </Button>
                  <Text color={tokens.colors.neutral[80]}>
                    &copy; IELTS Writing Helper All Rights Reserved
                  </Text>
                </View>
              )
            },
            SignIn: {
              Header() {
                const { tokens } = useTheme()

                return (
                  <Heading
                    padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
                    level={4}
                  >
                    {i18next.language === 'ja'
                      ? 'アカウントをお持ちの場合'
                      : 'If you have an account, Sign in.'}
                  </Heading>
                )
              },
            },
            SignUp: {
              Header() {
                const { tokens } = useTheme()

                return (
                  <Heading
                    padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
                    level={4}
                  >
                    {i18next.language === 'ja'
                      ? '新規にアカウント作成'
                      : 'Create a new account'}
                  </Heading>
                )
              },
              Footer() {
                return (
                  <View textAlign="center">
                    {i18next.language === 'ja'
                      ? '続行する場合、利用規約に同意することとします。'
                      : 'By continuing, you agree to the Terms of Conditions.'}
                    <Button
                      fontWeight="normal"
                      onClick={() =>
                        window?.open(Path.Terms, '_blank')?.focus()
                      }
                      size="small"
                      variation="link"
                    >
                      {i18next.language === 'ja'
                        ? '利用規約'
                        : 'Terms & Conditions'}
                    </Button>
                  </View>
                )
              },
            },
          }}
        >
          {({ signOut, user }) => (
            <>
              <ThemeProvider theme={theme}>
                <Router />
              </ThemeProvider>
            </>
          )}
        </Authenticator>
      </Box>
    </>
  )
})

Auth.displayName = 'Auth'
