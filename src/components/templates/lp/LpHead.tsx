import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { FC, memo } from 'react'

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import { Box, Button, Grid, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import { Path } from '@/constants/Path'

export const LpHead: FC = memo(() => {
  const t = useTranslations('LP')
  const router = useRouter()

  const toAuthPage = () => {
    router.push(Path.Auth)
  }

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
            <Button
              sx={{ mt: 5 }}
              variant="contained"
              endIcon={<DoubleArrowIcon />}
              onClick={toAuthPage}
              color="secondary"
            >
              <b>{t('startFreeButton')}</b>
            </Button>
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
