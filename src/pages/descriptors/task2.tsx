import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

import { Grid, Paper, useTheme } from '@mui/material'
import { useTranslations } from 'next-intl'

import Layout from '@/components/templates/Layout'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'

export default function NotificationSetting() {
  useGetAuthUser()
  const theme = useTheme()
  const t = useTranslations('Problem')
  const router = useRouter()

  return (
    <Layout
      title={t('create.title')}
      description={t('create.title')}
      breadcrumbs={[
        { label: 'WRITING TASK 2: Band Descriptors', href: undefined },
      ]}
    >
      <TitleBox title="WRITING TASK 2: Band Descriptors (public version)">
        <></>
      </TitleBox>
      <Grid container columnSpacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ minHeight: 800 }}>
            <iframe
              allowFullScreen
              height="800"
              width="100%"
              title="WRITING TASK 2: Band Descriptors (public version) - IELTS"
              src="https://www.ielts.org/-/media/pdfs/writing-band-descriptors-task-2.ashx"
            ></iframe>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  )
}

export const getStaticProps: GetServerSideProps = async (context) => {
  const { locale } = context
  return {
    props: { messages: require(`@/locales/${locale}.json`) },
  }
}
