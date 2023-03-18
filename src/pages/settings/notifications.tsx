import React from 'react'

import SaveIcon from '@mui/icons-material/Save'
import { Box, Button, Grid, Paper } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { TitleBox } from '@/components/templates/common/TitleBox'
import { SettingSidebar } from '@/components/templates/settings/SettingSidebar'
import { Path } from '@/constants/Path'
import { useSetBreadcrumbs } from '@/hooks/useSetBreadcrumbs'

export const NotificationSetting = () => {
  const { t } = useTranslation()
  useSetBreadcrumbs([
    { label: t('list.title'), href: Path.Problem },
    { label: t('create.title'), href: undefined },
  ])

  return (
    <>
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
    </>
  )
}
