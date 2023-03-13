import React, { FC, memo } from 'react'

import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import { StartButton } from '@/components/parts/lp/StartButton'

export const LpTrial: FC = memo(() => {
  const t = useTranslations('LP')

  return (
    <Box sx={{ textAlign: 'center', mt: 15 }}>
      <Typography variant="h5" fontWeight="bold">
        {t('trial.title')}
      </Typography>
      <br />
      <StartButton sx={{ mt: 2 }} />
    </Box>
  )
})

LpTrial.displayName = 'LpTrial'
