import { useRouter } from 'next/router'
import React, { FC, memo } from 'react'

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import { Button } from '@mui/material'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { Path } from '@/constants/Path'

export const LpFeatures: FC = memo(() => {
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
            PCやタブレットでIELTSライティングを <br />
            練習して保存、レビューができる。
          </Typography>
          <br />
          <Typography variant="body1" fontWeight="bold">
            もうノートにエッセイを書く必要はありません。 <br />
            PCやタブレットでIELTSライティングを練習して効率的に保存、レビューができます。{' '}
            <br />
          </Typography>
          <Button
            sx={{ mt: 5 }}
            variant="outlined"
            endIcon={<DoubleArrowIcon />}
            onClick={toAuthPage}
          >
            <b>Start Free Trial</b>
          </Button>
        </Grid>
        <Grid item xs={5}>
          <Typography variant="h5" fontWeight="bold">
            本番同様のデザインで <br />
            問題を解くことができる。
            <br />
          </Typography>
          <br />
          <Typography variant="body1" fontWeight="bold">
            問題を解くページは本番と同様のデザインかつ時間を計測できるためため、{' '}
            <br />
            本番同様の緊張感を味わうことができます。 <br />
            <br />
          </Typography>
          <Button
            sx={{ mt: 5 }}
            variant="outlined"
            endIcon={<DoubleArrowIcon />}
            onClick={toAuthPage}
            color="secondary"
          >
            <b>Start Free Trial</b>
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
            AIが自動で回答をレビューしてくれる。
          </Typography>
          <br />
          <Typography variant="body1" fontWeight="bold">
            今話題のOpen AIがあなたの回答をレビューし、 <br />
            スコアアップのためのアドバイスしてくれます。 <br />
          </Typography>
          <Button
            sx={{ mt: 5 }}
            endIcon={<DoubleArrowIcon />}
            onClick={toAuthPage}
            color="secondary"
          >
            <b>Start Free Trial</b>
          </Button>
        </Grid>
      </Grid>
    </>
  )
})

LpFeatures.displayName = 'LpFeatures'
