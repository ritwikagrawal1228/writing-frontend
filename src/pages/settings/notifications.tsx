import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

import SaveIcon from '@mui/icons-material/Save'
import { Box, Button, Grid, Paper, useTheme } from '@mui/material'
import { withSSRContext } from 'aws-amplify'
import { useTranslations } from 'next-intl'

import Layout from '@/components/templates/Layout'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { SettingSidebar } from '@/components/templates/settings/SettingSidebar'
import { Path } from '@/constants/Path'
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
        { label: t('list.title'), href: Path.Problem },
        { label: t('create.title'), href: undefined },
      ]}
    >
      <TitleBox title="Notification Setting">
        <Box sx={{ maxHeight: '36px' }}>
          <Button color="primary" variant="contained" startIcon={<SaveIcon />}>
            <b>{t('create.submitBtn')}</b>
          </Button>
        </Box>
      </TitleBox>
      <Grid container columnSpacing={2}>
        <Grid item xs={3}>
          <SettingSidebar />
        </Grid>
        <Grid item xs={9}>
          <Paper sx={{ minHeight: 200 }}></Paper>
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
