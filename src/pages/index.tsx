import { GetServerSideProps } from 'next'
import Head from 'next/head'
import * as React from 'react'

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import { Box, Button, Typography } from '@mui/material'
import Container from '@mui/material/Container'
import { useTranslations } from 'next-intl'

import LpNavBar from '@/components/templates/LpNavBar'

export default function Home() {
  const t = useTranslations('LP')

  const signInWithProvider = () => {
    return
  }

  return (
    <>
      <Head>
        <title>{t('title')}</title>
      </Head>
      <LpNavBar />
      <Container
        maxWidth="xl"
        sx={{
          backgroundImage: 'url(/img/lp/bg-darken.jpg)',
          height: 700,
          objectFit: 'cover',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            top: '30%',
            left: 0,
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h3" color="initial" fontWeight="bold">
              {t('catch')}
            </Typography>
            <Typography
              sx={{ mt: 5 }}
              variant="body1"
              color="initial"
              fontWeight="bold"
            >
              {t('catchDescription')}
            </Typography>
            <Button
              sx={{ mt: 5 }}
              variant="contained"
              endIcon={<DoubleArrowIcon />}
              onClick={() => signInWithProvider()}
            >
              <b>Start Now</b>
            </Button>
          </Container>
        </Box>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context
  return {
    props: { messages: require(`@/locales/${locale}.json`) },
  }
}
