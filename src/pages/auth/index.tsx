import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import {
  Authenticator,
  CheckboxField,
  useAuthenticator,
} from '@aws-amplify/ui-react'
import { Container, Skeleton, Box } from '@mui/material'
import '@aws-amplify/ui-react/styles.css'
import { Amplify, withSSRContext, I18n, Auth } from 'aws-amplify'
import { useTranslations } from 'next-intl'

import awsExports from '@/aws-exports'
import LpNavBar from '@/components/templates/lp/LpNavBar'
import { Path } from '@/constants/Path'

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
}

const TRACKING_ID = process.env.NEXT_PUBLIC_GA4_TRACKING_ID as string
Amplify.configure({ ...awsExports, ssr: true })

export default function AuthPage() {
  const { user } = useAuthenticator()
  const router = useRouter()
  const t = useTranslations('Auth')

  const report = (eventName: string) => {
    if (TRACKING_ID || !router.isPreview) {
      gtag('event', eventName, {
        page_path: window.location.pathname,
        send_to: TRACKING_ID,
      })
    }
  }

  I18n.setLanguage(router.locale)
  const dict = {
    ja: {
      'Sign In': 'ログイン',
      'Sign In with Google': 'Googleでログイン',
      'Sign in': 'ログイン',
      'Sign Up with Google': 'Googleでアカウント作成',
      'Create Account': 'アカウント作成',
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
          width: '100% !important',
          mt: 8,
          mx: '0 !important',
          pt: 8,
          backgroundColor: 'var(--amplify-colors-border-tertiary)',
          height: '100vh',
          mb: 8,
        }}
      >
        <Authenticator
          initialState="signIn"
          components={{
            SignUp: {
              FormFields() {
                const { validationErrors } = useAuthenticator()

                return (
                  <>
                    <Authenticator.SignUp.FormFields />

                    <CheckboxField
                      errorMessage={validationErrors.acknowledgement as string}
                      hasError={!!validationErrors.acknowledgement}
                      name="acknowledgement"
                      value="yes"
                      label={
                        <>
                          <p>
                            {t('termQuestion')}
                            <a
                              href="/terms"
                              target="_blank"
                              style={{ textDecoration: 'underline' }}
                            >
                              {t('termLink')}
                            </a>
                          </p>
                        </>
                      }
                    />
                  </>
                )
              },
            },
          }}
          services={{
            async handleSignUp(formData) {
              report('sign_up')
              return Auth.signUp(formData)
            },
            async handleSignIn(formData) {
              report('login')
              return Auth.signIn(formData)
            },
            async validateCustomSignUp(formData) {
              if (!formData.acknowledgement) {
                return {
                  acknowledgement: t('termErrorMsg'),
                }
              }
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context
  const { Auth } = withSSRContext(context)

  try {
    const u = await Auth.currentAuthenticatedUser()
    return {
      redirect: {
        permanent: false,
        destination: Path.Problem,
      },
    }
  } catch (err) {
    return {
      props: {
        messages: require(`@/locales/${locale}.json`),
      },
    }
  }
}
