import React, { FC, memo } from 'react'

import { Box, Grid, Typography } from '@mui/material'

export const LpFooter: FC = memo(() => {
  return (
    <Box sx={{ height: 100, mt: 15 }}>
      <Grid
        container
        justifyContent="center"
        alignContent="center"
        sx={{ height: '100%' }}
      >
        <Grid item>
          <Typography>
            © 2023 IELTS Writing Helper All rights reserved.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
})

LpFooter.displayName = 'LpFooter'
