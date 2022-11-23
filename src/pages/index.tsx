import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import { Box, Button, Typography } from '@mui/material'
import Container from '@mui/material/Container'
import { useTranslations } from 'next-intl'

import LpNavBar from '@/components/templates/LpNavBar'
import { Path } from '@/constants/Path'

export default function Home() {
  const t = useTranslations('LP')
  const router = useRouter()

  const toAuthPage = () => {
    router.push(Path.Auth)
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
              onClick={toAuthPage}
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
