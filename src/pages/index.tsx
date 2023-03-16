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
import { I18n } from 'aws-amplify'

import LpNavBar from '@/components/templates/lp/LpNavBar'
import { Path } from '@/constants/Path'

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
      'Reset Password': 'パスワードをリセットする',
      'Enter your email': 'メールアドレスを入力',
      'Send code': '認証コードを送信',
      'Back to Sign In': 'ログイン画面に戻る',
      Code: '認証コード',
      'Code *': '認証コード *',
      'New Password': '新しいパスワード',
      Submit: '送信',
      'Resend Code': '認証コードを再送',
      'If you have an account, Sign in.': 'アカウントをお持ちの場合',
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

                return (
                  <Heading
                    padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
                    level={4}
                  >
                    {router.locale === 'ja'
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
                    {router.locale === 'ja'
                      ? '新規にアカウント作成'
                      : 'Create a new account'}
                  </Heading>
                )
              },
              Footer() {
                return (
                  <View textAlign="center">
                    {router.locale === 'ja'
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
                      {router.locale === 'ja'
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
