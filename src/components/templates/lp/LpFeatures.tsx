import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { FC, memo } from 'react'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTranslations } from 'next-intl'

import { StartButton } from '@/components/parts/lp/StartButton'
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
        sx={{ mt: { xs: 0, md: 15 } }}
        alignItems="center"
        justifyContent="center"
        rowSpacing={{ xs: 15, md: 5 }}
      >
        <Grid item sx={{ display: { xs: 'none' } }} md={5}>
          <Image
            src="/img/lp/programming1.png"
            height={400}
            width={400}
            alt="pc & tablet"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight="bold">
            {t('feature.title1')}
          </Typography>
          <br />
          <Typography variant="body1" fontWeight="bold">
            {t('feature.desc1')}
          </Typography>
          <StartButton sx={{ mt: 5 }} variant="outlined" />
        </Grid>
        <Grid item xs={12} md={5}>
          <Typography variant="h5" fontWeight="bold">
            {t('feature.title2')}
          </Typography>
          <br />
          <Typography variant="body1" fontWeight="bold">
            {t('feature.desc2')}
            <br />
          </Typography>
          <StartButton sx={{ mt: 5 }} variant="outlined" color="secondary" />
        </Grid>
        <Grid item xs={6} sx={{ display: { xs: 'none' } }}>
          <Image
            src="/img/lp/frontFrameAnswer.png"
            height={350}
            width={574}
            alt="pc"
          />
        </Grid>
        <Grid item xs={6} sx={{ display: { xs: 'none' } }}>
          <Image
            src="/img/lp/feature3.svg"
            height={350}
            width={473}
            alt="review"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight="bold">
            {t('feature.title3')}
          </Typography>
          <br />
          <Typography variant="body1" fontWeight="bold">
            {t('feature.desc3')}
          </Typography>
          <StartButton sx={{ mt: 5 }} color="secondary" />
        </Grid>
      </Grid>
    </>
  )
})

LpFeatures.displayName = 'LpFeatures'
