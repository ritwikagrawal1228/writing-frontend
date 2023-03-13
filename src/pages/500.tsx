import { GetServerSideProps } from 'next'
import Head from 'next/head'
import React from 'react'

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Grid, Paper, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import LpNavBar from '@/components/templates/lp/LpNavBar'
import { fontSizes, spaces } from '@/themes/globalStyles'

export default function Page500() {
  const t = useTranslations('Problem')
  return (
    <>
      <Head>
        <title>Error</title>
      </Head>
      <LpNavBar isOnlyLogo={true} />
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 13 }}
      >
        <Grid
          item
          xs={10}
          md={7}
          lg={5}
          sx={{ textAlign: 'center' }}
          alignItems="center"
        >
          <Paper sx={{ py: spaces.xxxxl }}>
            <ErrorOutlineIcon color="error" />
            <Typography fontSize={fontSizes.xxl} fontWeight="bold">
              Error
            </Typography>
            <Typography fontSize={fontSizes.s}>
              Things are little unstable right now. Please try again later.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

Page500.displayName = 'Page500'

export const getStaticProps: GetServerSideProps = async (context) => {
  const { locale } = context
  return {
    props: { messages: require(`@/locales/${locale}.json`) },
  }
}
