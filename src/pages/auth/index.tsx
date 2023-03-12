import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import {
  Authenticator,
  CheckboxField,
  useAuthenticator,
} from '@aws-amplify/ui-react'
import Box from '@mui/material/Box'
import { Amplify, withSSRContext } from 'aws-amplify'

import '@aws-amplify/ui-react/styles.css'

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

Amplify.configure({ ...awsExports, ssr: true })

export default function Auth() {
  const { user } = useAuthenticator()
  const route = useRouter()
  // Redirect After Sign In Success
  useEffect(() => {
    if (user) {
      route.push(Path.Problem)
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
                            I agree with the{' '}
                            <a
                              href="/terms"
                              target="_blank"
                              style={{ textDecoration: 'underline' }}
                            >
                              Terms & Conditions
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
            async validateCustomSignUp(formData) {
              if (!formData.acknowledgement) {
                return {
                  acknowledgement: 'You must agree to the Terms & Conditions',
                }
              }
            },
          }}
        />
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
