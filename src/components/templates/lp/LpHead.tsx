import Image from 'next/image'
import React, { FC, memo } from 'react'

import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import { Box, Button, Grid, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import { StartButton } from '@/components/parts/lp/StartButton'

export const LpHead: FC = memo(() => {
  const t = useTranslations('LP')

  const toScrollDown = () => {
    window.scrollTo({
      top: 1000,
      behavior: 'smooth',
    })
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          px: 0,
          mt: 20,
        }}
      >
        <Grid container sx={{ px: 0 }}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold">
              {t('head.catch')}
            </Typography>
            <Button
              sx={{ mt: 5, mr: 1 }}
              variant="outlined"
              endIcon={<KeyboardDoubleArrowDownIcon />}
              onClick={toScrollDown}
              color="secondary"
            >
              <b>{t('head.seeMoreButton')}</b>
            </Button>
            <StartButton sx={{ mt: 5 }} color="secondary" variant="contained" />
            <Box sx={{ mt: 5, ml: 20 }}>
              <Image
                src="/img/lp/top.png"
                height={600}
                width={1070}
                alt="top"
                priority
                quality={50}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          width: '100%',
          px: 0,
        }}
      >
        <Grid container sx={{ px: 0 }} rowSpacing={20}>
          <Grid item xs={7}></Grid>
        </Grid>
      </Box>
    </>
  )
})

LpHead.displayName = 'LpHead'
