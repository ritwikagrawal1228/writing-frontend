import { GetServerSideProps } from 'next'
import Head from 'next/head'
import * as React from 'react'

import { Container, useTheme } from '@mui/material'
import { useTranslations } from 'next-intl'

import { LpFeatures } from '@/components/templates/lp/LpFeatures'
import { LpFooter } from '@/components/templates/lp/LpFooter'
import { LpHead } from '@/components/templates/lp/LpHead'
import LpNavBar from '@/components/templates/lp/LpNavBar'
import { LpPricing } from '@/components/templates/lp/LpPricing'
import { LpTrial } from '@/components/templates/lp/LpTrial'
import { ColorModeContext } from '@/context/ColorMode'

export default function Home() {
  const t = useTranslations('LP')
  const theme = useTheme()
  if (theme.palette.mode === 'dark') {
    const colorMode = React.useContext(ColorModeContext)
    colorMode.toggleColorMode()
    localStorage.setItem('theme', 'light')
  }

  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta property="description" content={t('description')} />
      </Head>
      <LpNavBar />
      <Container maxWidth="lg">
        <LpHead />
        <LpFeatures />
        <LpPricing />
        <LpTrial />
        <LpFooter />
      </Container>
    </>
  )
}

export const getStaticProps: GetServerSideProps = async (context) => {
  const { locale } = context
  return {
    props: { messages: require(`@/locales/${locale}.json`) },
  }
}
