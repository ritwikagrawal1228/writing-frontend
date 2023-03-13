import Link from 'next/link'
import React, { FC, memo } from 'react'

import { Box, Grid, Typography } from '@mui/material'

import { Path } from '@/constants/Path'

export const LpFooter: FC = memo(() => {
  return (
    <Box sx={{ height: 100, mt: 15 }}>
      <Grid
        container
        justifyContent="center"
        alignContent="center"
        sx={{ height: '100%', textAlign: 'center' }}
      >
        <Grid item>
          <Typography sx={{ mb: 2 }}>
            © 2023 IELTS Writing Helper All rights reserved.
          </Typography>
          <Link style={{ textDecoration: 'underline' }} href={Path.Privacy}>
            Privacy Policy
          </Link>
        </Grid>
      </Grid>
    </Box>
  )
})

LpFooter.displayName = 'LpFooter'
