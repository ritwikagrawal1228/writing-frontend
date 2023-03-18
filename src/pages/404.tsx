import React from 'react'

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Grid, Paper, Typography } from '@mui/material'

import LpNavBar from '@/components/templates/lp/LpNavBar'
import { fontSizes, spaces } from '@/themes/globalStyles'

export const Page404 = () => {
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
              Not Found
            </Typography>
            <Typography fontSize={fontSizes.s}>
              Page not found. Please check the URL.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
