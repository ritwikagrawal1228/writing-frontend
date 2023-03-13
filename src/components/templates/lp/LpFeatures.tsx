import Image from 'next/image'
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
          <Image
            src="/img/lp/programming1.png"
            height={400}
            width={400}
            alt="pc & tablet"
          />
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
          <Image
            src="/img/lp/frontFrameAnswer.png"
            height={350}
            width={574}
            alt="pc"
          />
        </Grid>
        <Grid item xs={6}>
          <Image
            src="/img/lp/feature3.svg"
            height={350}
            width={473}
            alt="review"
          />
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
