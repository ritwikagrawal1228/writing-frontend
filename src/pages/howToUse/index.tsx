import React, { memo } from 'react'

import { Grid, Paper, useMediaQuery, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { TitleBox } from '@/components/templates/common/TitleBox'
import { useSetBreadcrumbs } from '@/hooks/useSetBreadcrumbs'

export const HowToUse = memo(() => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))
  const { t } = useTranslation()
  useSetBreadcrumbs([{ label: t('Nav.menu.howToUse'), href: undefined }])

  return (
    <>
      <TitleBox title={t('Nav.menu.howToUse')}>
        <></>
      </TitleBox>
      <Grid container columnSpacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ minWidth: 800, textAlign: 'center', p: 3 }}>
            <iframe
              width={matches ? 800 : 300}
              height={matches ? 555 : 200}
              src="https://www.youtube.com/embed/pw9w-9cQE6g"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
})

HowToUse.displayName = 'HowToUse'
