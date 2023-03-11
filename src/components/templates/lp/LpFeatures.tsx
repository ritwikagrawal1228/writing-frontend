import { useRouter } from 'next/router'
import React, { FC, memo } from 'react'

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import { Button } from '@mui/material'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTranslations } from 'next-intl'

import { Path } from '@/constants/Path'

export const LpFeatures: FC = memo(() => {
  const t = useTranslations('LP')
  const router = useRouter()

  const toAuthPage = () => {
    router.push(Path.Auth)
  }

  return (
    <>
      <Grid
        container
        sx={{ mt: 15 }}
        alignItems="center"
        justifyContent="center"
        rowSpacing={15}
      >
        <Grid item xs={5}>
          <img src="/img/lp/programming1.png" alt="feature1" height={400} />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5" fontWeight="bold">
            {t('feature.title1')}
          </Typography>
          <br />
          <Typography variant="body1" fontWeight="bold">
            {t('feature.desc1')}
          </Typography>
          <Button
            sx={{ mt: 5 }}
            variant="outlined"
            endIcon={<DoubleArrowIcon />}
            onClick={toAuthPage}
          >
            <b>{t('startFreeButton')}</b>
          </Button>
        </Grid>
        <Grid item xs={5}>
          <Typography variant="h5" fontWeight="bold">
            {t('feature.title2')}
          </Typography>
          <br />
          <Typography variant="body1" fontWeight="bold">
            {t('feature.desc2')}
            <br />
          </Typography>
          <Button
            sx={{ mt: 5 }}
            variant="outlined"
            endIcon={<DoubleArrowIcon />}
            onClick={toAuthPage}
            color="secondary"
          >
            <b>{t('startFreeButton')}</b>
          </Button>
        </Grid>
        <Grid item xs={6}>
          <img src="/img/lp/frontFrameAnswer.png" alt="feature2" height={350} />
        </Grid>
        <Grid item xs={6}>
          <img src="/img/lp/feature3.svg" alt="feature3" height={350} />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5" fontWeight="bold">
            {t('feature.title3')}
          </Typography>
          <br />
          <Typography variant="body1" fontWeight="bold">
            {t('feature.desc3')}
          </Typography>
          <Button
            sx={{ mt: 5 }}
            endIcon={<DoubleArrowIcon />}
            onClick={toAuthPage}
            color="secondary"
          >
            <b>{t('startFreeButton')}</b>
          </Button>
        </Grid>
      </Grid>
    </>
  )
})

LpFeatures.displayName = 'LpFeatures'
