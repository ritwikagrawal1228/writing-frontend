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
