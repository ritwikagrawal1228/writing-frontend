import { useRouter } from 'next/router'
import React, { FC, memo } from 'react'

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import { Box, Button, Typography } from '@mui/material'

import { Path } from '@/constants/Path'

export const LpTrial: FC = memo(() => {
  const router = useRouter()

  const toAuthPage = () => {
    router.push(Path.Auth)
  }

  return (
    <Box sx={{ textAlign: 'center', mt: 15 }}>
      <Typography variant="h5" fontWeight="bold">
        すぐに無料で体験することができます。
      </Typography>
      <br />
      <Button
        sx={{ mt: 2 }}
        variant="outlined"
        endIcon={<DoubleArrowIcon />}
        onClick={toAuthPage}
      >
        <b>無料で始めてみる</b>
      </Button>
    </Box>
  )
})

LpTrial.displayName = 'LpTrial'
