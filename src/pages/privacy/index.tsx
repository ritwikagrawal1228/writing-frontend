import Head from 'next/head'
import React from 'react'

import { Box, Container } from '@mui/material'

import LpNavBar from '@/components/templates/lp/LpNavBar'
import { PrivacyPolicy } from '@/components/templates/privacy/PrivacyPolicy'

export default function Terms() {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <LpNavBar isOnlyLogo={true} />
      <Box sx={{}}>
        <Container maxWidth="lg" sx={{ mt: 13 }}>
          <PrivacyPolicy />
        </Container>
      </Box>
    </>
  )
}
