import React from 'react'

import { Grid, Paper, useTheme } from '@mui/material'

import Layout from '@/components/templates/Layout'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { useTranslation } from 'react-i18next'
import { useSetBreadcrumbs } from '@/hooks/useSetBreadcrumbs'

export const DescriptorTask2 = () => {
  useSetBreadcrumbs([
    { label: 'WRITING TASK 2: Band Descriptors', href: undefined },
  ])

  return (
    <>
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
    </>
  )
}
