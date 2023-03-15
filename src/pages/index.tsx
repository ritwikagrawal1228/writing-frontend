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
import { SiteUrl } from '@/constants/SiteUrl'
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
        <meta
          property="og:title"
          content="IELTS Writing Helper | IELTSライティング学習効率化アプリ"
        />
        <meta
          property="og:description"
          content="IELTS Writing HelperはIELTSライティングの学習を効率的にするためのWebアプリです。IELTSライティングの問題を作成し、回答を保存、レビューができます。また、AIがあなたの回答をレビューし、スコアアップのためのアドバイスしてくれます。"
        />
        <meta property="og:site_name" content="IELTS Writing Helper" />
        <meta property="og:image" content={`${SiteUrl}/ogp.png`} />
        <meta property="og:url" content={`${SiteUrl}/ogp.png`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ieltswritingapp" />
        <meta
          name="twitter:title"
          content="IELTS Writing Helper | IELTSライティング学習効率化アプリ"
        />
        <meta
          name="twitter:description"
          content="IELTS Writing HelperはIELTSライティングの学習を効率的にするためのWebアプリです。IELTSライティングの問題を作成し、回答を保存、レビューができます。また、AIがあなたの回答をレビューし、スコアアップのためのアドバイスしてくれます。"
        />
        <meta name="twitter:image" content={`${SiteUrl}/ogp.png`} />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context
  return {
    props: {
      messages: require(`@/locales/${locale}.json`),
    },
  }
}
