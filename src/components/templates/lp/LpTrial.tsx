import { useRouter } from 'next/router'
import React, { FC, memo } from 'react'

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import { Box, Button, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import { Path } from '@/constants/Path'

export const LpTrial: FC = memo(() => {
  const t = useTranslations('LP')
  const router = useRouter()

  const toAuthPage = () => {
    router.push(Path.Auth)
  }

  return (
    <Box sx={{ textAlign: 'center', mt: 15 }}>
      <Typography variant="h5" fontWeight="bold">
        {t('trial.title')}
      </Typography>
      <br />
      <Button
        sx={{ mt: 2 }}
        variant="outlined"
        endIcon={<DoubleArrowIcon />}
        onClick={toAuthPage}
      >
        <b>{t('startFreeButton')}</b>
      </Button>
    </Box>
  )
})

LpTrial.displayName = 'LpTrial'
