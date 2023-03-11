import { useRouter } from 'next/router'
import React, { FC, memo } from 'react'

import StarIcon from '@mui/icons-material/StarBorder'
import { Card, CardHeader } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTranslations } from 'next-intl'

import { Path } from '@/constants/Path'
import { colors } from '@/themes/globalStyles'

export const LpPricing: FC = memo(() => {
  const t = useTranslations('LP')
  const router = useRouter()

  const toAuthPage = () => {
    router.push(Path.Auth)
  }

  const tiers = [
    {
      title: t('pricing.free.title'),
      price: '0',
      description: [
        t('pricing.free.desc1'),
        t('pricing.free.desc2'),
        t('pricing.free.desc3'),
      ],
      buttonText: t('pricing.free.button'),
      buttonVariant: 'outlined',
    },
    {
      title: t('pricing.pro.title'),
      subheader: t('pricing.pro.subheader'),
      price: '0',
      description: [
        t('pricing.pro.desc1'),
        t('pricing.pro.desc2'),
        t('pricing.pro.desc3'),
        t('pricing.pro.desc4'),
      ],
      buttonText: t('pricing.pro.button'),
      buttonVariant: 'contained',
    },
  ]

  return (
    <Box sx={{ textAlign: 'center', mt: 15 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        {t('pricing.title')}
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        {t('pricing.desc')}
        <br />
        <br />
      </Typography>
      <Grid container spacing={5} justifyContent="center">
        {tiers.map((tier) => (
          <Grid
            item
            key={tier.title}
            xs={12}
            sm={tier.title === 'Enterprise' ? 12 : 6}
            md={4}
          >
            <Card>
              <CardHeader
                title={tier.title}
                subheader={tier.subheader}
                titleTypographyProps={{ align: 'center' }}
                action={tier.title === 'Pro' ? <StarIcon /> : null}
                subheaderTypographyProps={{
                  align: 'center',
                }}
                sx={{
                  color: colors.primary.main,
                  backgroundColor: '#E3183714',
                }}
              />
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                    mb: 2,
                  }}
                >
                  <Typography component="h2" variant="h3" color="text.primary">
                    ¥{tier.price}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    /{t('pricing.monthUnit')}
                  </Typography>
                </Box>
                {tier.description.map((line) => (
                  <Typography variant="subtitle1" align="center" key={line}>
                    {line}
                  </Typography>
                ))}
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant={tier.buttonVariant as 'outlined' | 'contained'}
                  onClick={toAuthPage}
                >
                  {tier.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
})

LpPricing.displayName = 'LpPricing'
