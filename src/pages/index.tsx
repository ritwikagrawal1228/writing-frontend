import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import {
  Authenticator,
  Button,
  Heading,
  View,
  useAuthenticator,
  useTheme,
} from '@aws-amplify/ui-react'
import { Container, Skeleton, Box } from '@mui/material'
import '@aws-amplify/ui-react/styles.css'
import { Amplify, I18n } from 'aws-amplify'
import { useTranslations } from 'next-intl'

import awsExports from '@/aws-exports'
import LpNavBar from '@/components/templates/lp/LpNavBar'
import { Path } from '@/constants/Path'

Amplify.configure({ ...awsExports, ssr: true })

export default function AuthPage() {
  const { user } = useAuthenticator()
  const router = useRouter()

  I18n.setLanguage(router.locale)
  const dict = {
    ja: {
      'Sign In': 'ログイン',
      'Sign in': 'ログインする',
      'Create Account': 'アカウントを作成する',
      Email: 'メールアドレス',
      'Enter your Email': 'メールアドレスを入力してください',
      Password: 'パスワード',
      'Enter your Password': 'パスワードを入力してください',
      'Forgot your password?': 'パスワードを忘れた場合',
      'Confirm Password': 'パスワード確認',
      'Please confirm your Password': 'パスワードを再度入力してください',
      Name: '名前 (ニックネーム)',
      'Enter your Name': '名前を入力してください',
    },
  }

  I18n.putVocabularies(dict)
  // Redirect After Sign In Success
  useEffect(() => {
    if (user) {
      router.push(Path.Problem)
    }
  }, [user])

  return (
    <>
      <Head>
        <title>Sign In | Sign Up</title>
      </Head>
      <LpNavBar isOnlyLogo={true} />
      <Box
        sx={{
          mt: 8,
          pt: 8,
        }}
      >
        <Authenticator
          initialState="signIn"
          components={{
            SignIn: {
              Header() {
                const { tokens } = useTheme()
                const t = useTranslations('Auth')

                return (
                  <Heading
                    padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
                    level={4}
                  >
                    {t('signInHeader')}
                  </Heading>
                )
              },
            },
            SignUp: {
              Header() {
                const { tokens } = useTheme()
                const t = useTranslations('Auth')

                return (
                  <Heading
                    padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
                    level={4}
                  >
                    {t('signUpHeader')}
                  </Heading>
                )
              },
              Footer() {
                const t = useTranslations('Auth')

                return (
                  <View textAlign="center">
                    {t('termQuestion')}
                    <Button
                      fontWeight="normal"
                      onClick={() =>
                        window?.open(Path.Terms, '_blank')?.focus()
                      }
                      size="small"
                      variation="link"
                    >
                      {t('termLink')}
                    </Button>
                  </View>
                )
              },
            },
          }}
        >
          {({ signOut, user }) => (
            <Box
              component="main"
              sx={{
                minHeight: 'calc(100vh - 64px)',
                backgroundColor: (theme) => theme.palette.background.default,
                color: (theme) => theme.palette.text.primary,
              }}
            >
              <Container maxWidth="lg" sx={{ pt: '30px' }}>
                <Skeleton variant="rounded" width={1152} height={460} />
              </Container>
            </Box>
          )}
        </Authenticator>
      </Box>
    </>
  )
}

export const getStaticProps: GetServerSideProps = async (context) => {
  const { locale } = context
  return {
    props: { messages: require(`@/locales/${locale}.json`) },
  }
}
