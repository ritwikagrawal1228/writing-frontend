import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import React from 'react'

import { Box, Container } from '@mui/material'

import LpNavBar from '@/components/templates/lp/LpNavBar'
import { TermsAndConditions } from '@/components/templates/terms/TermsAndConditions'

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms & Conditions</title>
      </Head>
      <LpNavBar isOnlyLogo={true} />
      <Box sx={{ textAlign: 'center' }}>
        <Container maxWidth="lg" sx={{ mt: 13 }}>
          <TermsAndConditions />
        </Container>
      </Box>
    </>
  )
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { locale } = context

  try {
    return {
      props: {
        messages: require(`@/locales/${locale}.json`),
      },
    }
  } catch (err) {
    console.error(err)
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  }
}
