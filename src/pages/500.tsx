import React from 'react'

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Grid, Paper, Typography } from '@mui/material'

import LpNavBar from '@/components/templates/lp/LpNavBar'
import { fontSizes, spaces } from '@/themes/globalStyles'
import { useTranslation } from 'react-i18next'

import '@/index.css'

export const Page500 = () => {
  return (
    <>
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
