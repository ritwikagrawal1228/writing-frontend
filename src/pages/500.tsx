import React from 'react'

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Grid, Paper, Typography } from '@mui/material'

import { fontSizes, spaces } from '@/themes/globalStyles'

export default function Page500() {
  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{ mt: spaces.l }}
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
              エラーが発生しました
            </Typography>
            <Typography fontSize={fontSizes.s} sx={{ mt: spaces.s }}>
              申し訳ありません
            </Typography>
            <Typography fontSize={fontSizes.s}>
              しばらくお待ちいただくか、 システム管理者にお問い合わせください
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

Page500.displayName = 'Page500'
