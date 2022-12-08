import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect } from 'react'

import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import EditIcon from '@mui/icons-material/Edit'
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@mui/material'
import { Storage, withSSRContext } from 'aws-amplify'
import { useTranslations } from 'next-intl'

import Layout from '@/components/templates/Layout'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { answerStatus, answerStr } from '@/constants/AnswerStatus'
import { Path } from '@/constants/Path'
import { ProblemType } from '@/constants/ProblemType'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { problemService } from '@/services/problemService'
import { colors, fontSizes } from '@/themes/globalStyles'
import { Answer } from '@/types/model/answer'
import { Problem } from '@/types/model/problem'
import { roundSentence } from '@/utils/roundSentence'

type Props = {
  problem: Problem
  userStr: string
}

export default function ProblemDetail({ problem, userStr }: Props) {
  const { user } = useGetAuthUser(userStr)
  const t = useTranslations('Problem')
  const router = useRouter()
  const theme = useTheme()
  const [img, setImg] = React.useState<string | undefined>()
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

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

  const moveEditPage = (id: string) => {
    router.push(`${Path.ProblemEdit}/${id}`)
  }

  const confirmDelete = () => {
    setIsAlertOpen(true)
  }

  const handleAlertClose = () => {
    setIsAlertOpen(false)
  }

  const deleteProblem = async (id: string) => {
    setIsAlertOpen(false)
    setIsDeleting(true)

    problemService
      .deleteProblemById(id, user)
      .then((res) => {
        console.log(res)

        router.push(Path.Problem)
      })
      .catch((err) => {
        console.log(err)

        setIsDeleting(false)
      })
  }

  const closeBackdrop = () => {
    setIsDeleting(false)
  }

  const moveAnswerPage = (id: string) => {
    router.push(`${Path.ProblemAnswer}/${id}`)
  }

  const redeemOrReview = (answer: Answer) => {
    if (answer.status === answerStatus.completed) {
      router.push(`${Path.ProblemAnswerReview}/${problem.id}`)
    } else {
      router.push(`${Path.ProblemAnswerRedeem}/${answer.id}`)
    }
  }

  return (
    <Layout
      title={problem.title}
      description={problem.question}
      breadcrumbs={[
        { label: t('list.title'), href: Path.Problem },
        { label: t('detail.title'), href: undefined },
      ]}
    >
      {isDeleting && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isDeleting}
          onClick={closeBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Grid container columnSpacing={2}>
        <Grid item xs={6}>
          <TitleBox title={t('detail.title')}>
            <Box sx={{ maxHeight: '36px' }}>
              <Button
                color="primary"
                variant="outlined"
                startIcon={<DeleteForeverIcon />}
                sx={{ mr: 2 }}
                onClick={() => confirmDelete()}
              >
                <b>{t('detail.deleteBtn')}</b>
              </Button>
              <Dialog
                open={isAlertOpen}
                onClose={handleAlertClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {t('detail.deleteConfirmTitle')}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {t('detail.deleteConfirmDescription')}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button color="inherit" onClick={handleAlertClose}>
                    {t('detail.deleteConfirmCancelBtn')}
                  </Button>
                  <Button
                    onClick={() => deleteProblem(problem.id)}
                    variant="contained"
                    autoFocus
                  >
                    {t('detail.deleteConfirmDeleteBtn')}
                  </Button>
                </DialogActions>
              </Dialog>
              <Button
                color="secondary"
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => moveEditPage(problem.id)}
              >
                <b>{t('detail.editBtn')}</b>
              </Button>
            </Box>
          </TitleBox>
          <Paper sx={{ width: '100%', minHeight: '600px' }}>
            <Box
              sx={{
                p: 3,
                borderBottom: `1px solid${colors.disabled.light}`,
                width: '100%',
              }}
            >
              <Typography fontSize={fontSizes.m} color="text.secondary">
                {t('form.title')}:{' '}
              </Typography>
              <Typography
                sx={{ ml: 3, mt: 1, wordWrap: 'break-word' }}
                fontWeight="bold"
              >
                {problem.title}
              </Typography>
            </Box>
            <Box
              sx={{ p: 3, borderBottom: `1px solid${colors.disabled.light}` }}
            >
              <Typography fontSize={fontSizes.m} color="text.secondary">
                {t('form.taskType')}:{' '}
              </Typography>
              <Chip
                sx={{ ml: 3, mt: 1 }}
                label={ProblemType[problem.taskType]}
                variant="outlined"
                color={
                  ProblemType[problem.taskType] === 'Task 1'
                    ? 'primary'
                    : 'secondary'
                }
              />
            </Box>
            <Box
              sx={{
                p: 3,
                borderBottom: `1px solid${colors.disabled.light}`,
                width: '100%',
              }}
            >
              <Typography fontSize={fontSizes.m} color="text.secondary">
                {t('form.question')}:{' '}
              </Typography>
              <Typography
                sx={{ ml: 3, mt: 1, wordWrap: 'break-word' }}
                fontWeight="bold"
              >
                {problem.question}
              </Typography>
            </Box>
            <Box
              sx={{ p: 3, borderBottom: `1px solid${colors.disabled.light}` }}
            >
              <Typography fontSize={fontSizes.m} color="text.secondary">
                {t('form.questionImage')}:{' '}
              </Typography>
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
          <TitleBox title={t('detail.answer.list.title')}>
            <Box sx={{ maxHeight: '36px' }}>
              <Button
                color="primary"
                variant="contained"
                startIcon={<BorderColorOutlinedIcon />}
                onClick={() => moveAnswerPage(problem.id)}
              >
                <b>{t('detail.answer.list.addBtn')}</b>
              </Button>
            </Box>
          </TitleBox>
          <Paper sx={{ width: '100%', minHeight: '600px', p: 3 }}>
            {problem.answers.map((answer) => (
              <Fragment key={answer.id}>
                <Box>
                  <Card
                    sx={{
                      mb: 2,
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? colors.base.gray
                          : colors.disabled.light,
                    }}
                    onClick={() => redeemOrReview(answer)}
                  >
                    <CardContent>
                      <Chip
                        label={
                          answerStr[answer.status as keyof typeof answerStr]
                        }
                        variant="outlined"
                        color={
                          answerStr[answer.status as keyof typeof answerStr] ===
                          'Completed'
                            ? 'primary'
                            : 'secondary'
                        }
                      />
                      <Typography sx={{ mt: 2 }} fontSize={fontSizes.m}>
                        {roundSentence(answer.answer, 180)}
                      </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                      <Grid
                        container
                        sx={{
                          p: 1,
                          alignItems: 'end',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Grid item>
                          <Button
                            size="small"
                            color="inherit"
                            variant="outlined"
                            sx={{ mr: 2 }}
                            startIcon={<DoubleArrowIcon />}
                            onClick={() => redeemOrReview(answer)}
                          >
                            {answer.status === answerStatus.completed
                              ? 'Review'
                              : 'Redeem'}
                          </Button>
                        </Grid>
                        <Grid item>
                          <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            Answered:{' '}
                            {answer.createdAt &&
                              new Date(answer.createdAt).toLocaleString(
                                router.locale,
                              )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardActions>
                  </Card>
                </Box>
              </Fragment>
            ))}
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

    const result = await problemService.getProblemById(id, user)

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
