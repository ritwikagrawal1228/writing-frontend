import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect } from 'react'

import Layout from '@/components/templates/Layout'

import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined'

import { TitleBox } from '@/components/templates/common/TitleBox'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import { answerStatus, answerStr } from '@/constants/AnswerStatus'

import EditIcon from '@mui/icons-material/Edit'

import { Path } from '@/constants/Path'

import {
  Box,
  Button,
  Card,
  CardActionArea,
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

import { ProblemType, ProblemType1 } from '@/constants/ProblemType'

import { Storage, withSSRContext } from 'aws-amplify'

import { useGetAuthUser } from '@/hooks/useGetAuthUser'

import { useTranslations } from 'next-intl'

import { answerService } from '@/services/answerService'

import { useDispatch } from 'react-redux'

import { problemService } from '@/services/problemService'
import { commonSlice } from '@/store/common'
import { colors, fontSizes } from '@/themes/globalStyles'
import { Answer } from '@/types/model/answer'
import { Problem } from '@/types/model/problem'
import { roundSentence } from '@/utils/roundSentence'

type Props = {
  problem: Problem
  userStr: string
}

export default function ProblemDetail({ problem, userStr }: Props) {
  const t = useTranslations('Problem')
  const router = useRouter()
  const theme = useTheme()
  const [img, setImg] = React.useState<string | undefined>()
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [answerModels, setAnswerModels] = React.useState<Answer[]>([])
  const [isAnswerLoading, setIsAnswerLoading] = React.useState(false)
  const dispatch = useDispatch()
  useGetAuthUser(userStr)

  useEffect(() => {
    if (!problem) {
      return
    }
    if (problem.questionImageKey) {
      Storage.get(problem.questionImageKey)
        .then((res) => {
          setImg(res)
        })
        .catch((err) => {
          console.error(err)
        })
    }

    setIsAnswerLoading(true)
    answerService
      .getAnswersByProblemId(problem.id)
      .then(({ data }) => {
        setAnswerModels(data.answersByProblemId)
      })
      .finally(() => {
        setIsAnswerLoading(false)
      })
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
    dispatch(commonSlice.actions.updateIsBackdropShow(true))

    await problemService
      .deleteProblemById(id)
      .then((res) => {
        router.push(Path.Problem)
      })
      .catch((err) => {
        console.log(err)
      })
    dispatch(commonSlice.actions.updateIsBackdropShow(false))
  }

  const moveAnswerPage = (id: string) => {
    router.push(`${Path.ProblemAnswer}/${id}`)
  }

  const redeemOrReview = (answer: Answer) => {
    if (answer.status === answerStatus.completed) {
      router.push(`${Path.ProblemAnswerReview}/${answer.id}`)
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
      <Grid container columnSpacing={3}>
        <Grid item xs={5}>
          <TitleBox title={t('detail.title')}>
            <Box sx={{ maxHeight: '36px' }}>
              <Button
                color="primary"
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
                startIcon={<EditIcon />}
                onClick={() => moveEditPage(problem.id)}
              >
                <b>{t('detail.editBtn')}</b>
              </Button>
            </Box>
          </TitleBox>
          <Paper
            sx={{
              width: '100%',
              minHeight: '600px',
              maxHeight: '700px',
              overflow: 'auto',
            }}
          >
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
            {problem.taskType === ProblemType1 && (
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
            )}
          </Paper>
        </Grid>
        <Grid item xs={7}>
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
          <Paper
            sx={{
              width: '100%',
              minHeight: '600px',
              maxHeight: '700px',
              overflow: 'auto',
              p: 3,
            }}
          >
            {answerModels.length > 0 ? (
              answerModels.map((answer) => (
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
                      <CardActionArea>
                        <CardContent>
                          <Chip
                            variant="outlined"
                            label={
                              answerStr[answer.status as keyof typeof answerStr]
                            }
                            color={
                              answerStr[
                                answer.status as keyof typeof answerStr
                              ] === 'Completed'
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
                              <Typography
                                sx={{ fontSize: 14 }}
                                color="text.secondary"
                                gutterBottom
                              >
                                Review comments: {'TODO'}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography
                                sx={{ fontSize: 14 }}
                                color="text.secondary"
                                gutterBottom
                              >
                                Last Answered:{' '}
                                {answer.createdAt &&
                                  new Date(answer.updatedAt).toLocaleString(
                                    router.locale,
                                  )}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardActions>
                      </CardActionArea>
                    </Card>
                  </Box>
                </Fragment>
              ))
            ) : (
              <Box sx={{ width: '100%', textAlign: 'center', mt: 5 }}>
                {isAnswerLoading ? (
                  <CircularProgress />
                ) : (
                  <>
                    <Typography sx={{ mb: 2 }}>
                      There is no answer yet.
                    </Typography>
                    <Button
                      color="primary"
                      variant="outlined"
                      onClick={() => moveAnswerPage(problem.id)}
                    >
                      <b>{t('detail.answer.list.addBtn')}</b>
                    </Button>
                  </>
                )}
              </Box>
            )}
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
