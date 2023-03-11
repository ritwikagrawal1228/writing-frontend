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

import { Path } from '@/constants/Path'
import { colors } from '@/themes/globalStyles'

export const LpPricing: FC = memo(() => {
  const router = useRouter()

  const toAuthPage = () => {
    router.push(Path.Auth)
  }

  const tiers = [
    {
      title: 'Free',
      price: '0',
      description: [
        '10問まで登録可能',
        '回答数に上限なし',
        '文法やスペルミスの自動提案機能',
      ],
      buttonText: '無料で始める',
      buttonVariant: 'outlined',
    },
    {
      title: 'Pro',
      subheader: '一番人気',
      price: '891',
      description: [
        'すべてのフリープランの機能',
        '10問以上の問題を登録可能',
        'AIによる解答提案機能',
        '広告が非表示',
      ],
      buttonText: '今すぐ始める',
      buttonVariant: 'contained',
    },
  ]

  return (
    <Box sx={{ textAlign: 'center', mt: 15 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        料金プラン
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        IELTSライティングを低価格で効率的に学習
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
                    /月
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
