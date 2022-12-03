import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import SendIcon from '@mui/icons-material/Send'
import { Button, Grid, Paper, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Storage, withSSRContext } from 'aws-amplify'
import { useTranslations } from 'next-intl'

import Layout from '@/components/templates/Layout'
import { Stopwatch } from '@/components/templates/common/Stopwatch'
import { Path } from '@/constants/Path'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { postService } from '@/services/postService'
import { fontSizes } from '@/themes/globalStyles'
import { Problem } from '@/types/model/problem'

type Props = {
  problem: Problem
  userStr: string
}

export default function Answer({ problem, userStr }: Props) {
  const { user } = useGetAuthUser(userStr)
  const t = useTranslations('Problem')
  const ta = useTranslations('Answer')
  const router = useRouter()
  const [img, setImg] = React.useState<string | undefined>()
  const [answer, setAnswer] = React.useState<string>('')
  const [time, setTime] = React.useState<number>(20)
  const [countDownSec, setCountDownSec] = React.useState<number>(0)

  useEffect(() => {
    if (problem.questionImageKey) {
      Storage.get(problem.questionImageKey)
        .then((res) => {
          setImg(res)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }, [problem])

  return (
    <Layout
      title={problem.title}
      description={problem.question}
      breadcrumbs={[
        { label: t('list.title'), href: Path.Problem },
        { label: t('detail.title'), href: undefined },
        { label: ta('create.title'), href: undefined },
      ]}
    >
      <Grid container alignItems="center">
        <Grid item xs={6}>
          <Typography fontSize={fontSizes.xxl} fontWeight="bold">
            {problem.title}
          </Typography>
        </Grid>
        <Grid item xs={3} textAlign="start">
          <Stopwatch time={time} countDownSec={countDownSec} />
        </Grid>
        <Grid item xs={3} textAlign="right">
          <Button color="inherit" variant="outlined" sx={{ mr: 2 }}>
            <b>Cancel</b>
          </Button>
          <Button color="primary" variant="contained" startIcon={<SendIcon />}>
            <b>Submit</b>
          </Button>
        </Grid>
      </Grid>
      <Grid container alignItems="center" sx={{ my: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography fontWeight="bold" sx={{ pb: 2 }}>
              {problem.taskType === 'Type_#Task1' ? 'Part1' : 'Part2'}
            </Typography>
            <Typography>
              You should spend about{' '}
              {problem.taskType === 'Type_#Task1' ? 20 : 40} minutes on this
              task. Write {problem.taskType === 'Type_#Task1' ? 150 : 250}{' '}
              words.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid container columnSpacing={2}>
        <Grid item xs={6}>
          <Paper sx={{ width: '100%', minHeight: '600px' }}>
            <Box
              sx={{
                p: 3,
                width: '100%',
              }}
            >
              <Typography
                sx={{ ml: 3, mt: 1, wordWrap: 'break-word' }}
                fontWeight="bold"
              >
                {problem.question}
              </Typography>
            </Box>
            <Box sx={{ px: 3, pb: 3 }}>
              <Box sx={{ mt: 1 }}>
                <img
                  src={img}
                  style={{
                    width: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ width: '100%', minHeight: '600px', p: 3 }}>
            <TextField
              inputProps={{ style: { fontSize: fontSizes.m } }}
              color="secondary"
              fullWidth
              multiline
              rows={30}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <Typography sx={{ mt: 1 }}>
              Word Count: {answer ? answer.trim().split(/\s+/).length : 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  )
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { locale } = context
  const { Auth } = withSSRContext({ req: context.req })

  try {
    const user = await Auth.currentAuthenticatedUser()

    const { id } = context.query
    if (typeof id !== 'string') {
      return { notFound: true }
    }

    const result = await postService.getProblemById(id, user)

    return {
      props: {
        problem: result.problem,
        userStr: JSON.stringify(user.attributes),
        messages: require(`@/locales/${locale}.json`),
      },
    }
  } catch (err) {
    console.error(err)
    return {
      redirect: {
        permanent: false,
        destination: '/auth',
      },
    }
  }
}
