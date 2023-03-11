import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'
import { Container } from '@mui/material'
import { Amplify, withSSRContext } from 'aws-amplify'

import '@aws-amplify/ui-react/styles.css'

import awsExports from '@/aws-exports'
import LpNavBar from '@/components/templates/lp/LpNavBar'
import { Path } from '@/constants/Path'

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
      <Container
        maxWidth="xl"
        sx={{
          pt: 8,
          backgroundColor: 'var(--amplify-colors-border-tertiary)',
          height: '100vh',
        }}
      >
        <Authenticator />
      </Container>
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
