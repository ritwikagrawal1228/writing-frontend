import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useState } from 'react'

import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
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
  Divider,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { Storage, withSSRContext } from 'aws-amplify'
import { useTranslations } from 'next-intl'
import { useDispatch } from 'react-redux'

import Layout from '@/components/templates/Layout'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { answerStatus, answerStr } from '@/constants/AnswerStatus'
import { Path } from '@/constants/Path'
import { ProblemType, ProblemType1 } from '@/constants/ProblemType'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { answerService } from '@/services/answerService'
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
  useGetAuthUser(userStr)
  const t = useTranslations('Problem')
  const router = useRouter()
  const theme = useTheme()
  const [img, setImg] = React.useState<string | undefined>()
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [answerModels, setAnswerModels] = React.useState<Answer[]>([])
  const [isAnswerLoading, setIsAnswerLoading] = React.useState(false)
  const dispatch = useDispatch()

  const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null)
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMenu(event.currentTarget)
  }
  const handleCloseUserMenu = (menu: string) => {
    switch (menu) {
      case 'edit':
        moveEditPage()
        break
      case 'delete':
        confirmDelete()
        break
      default:
        break
    }

    setAnchorElMenu(null)
  }

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

  const moveEditPage = () => {
    router.push(`${Path.ProblemEdit}/${problem.id}`)
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

  const moveAnswerPage = () => {
    router.push(`${Path.ProblemAnswer}/${problem.id}`)
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
              <Tooltip title="Open menu">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <MenuOpenIcon />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElMenu}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElMenu)}
                onClose={handleCloseUserMenu}
              >
                <List
                  sx={{
                    width: '100%',
                    maxWidth: 360,
                    bgcolor: 'background.paper',
                  }}
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                >
                  <ListItemButton onClick={() => handleCloseUserMenu('edit')}>
                    <ListItemIcon>
                      <EditIcon />
                    </ListItemIcon>
                    <ListItemText primary={t('detail.editMenu')} />
                  </ListItemButton>
                  <ListItemButton onClick={() => handleCloseUserMenu('delete')}>
                    <ListItemIcon>
                      <DeleteForeverIcon />
                    </ListItemIcon>
                    <ListItemText primary={t('detail.deleteMenu')} />
                  </ListItemButton>
                </List>
              </Menu>
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
                  <Button
                    color="inherit"
                    variant="outlined"
                    onClick={handleAlertClose}
                  >
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
                width: '100%',
              }}
            >
              <Typography
                fontSize={fontSizes.m}
                color="text.secondary"
                fontWeight="bold"
              >
                {t('form.title')}
              </Typography>
              <Typography
                fontSize={fontSizes.m}
                sx={{ mt: 2, wordWrap: 'break-word' }}
              >
                {problem.title}
              </Typography>
            </Box>
            <Divider sx={{ mx: 3 }} />
            <Box
              sx={{
                p: 3,
                width: '100%',
              }}
            >
              <Typography
                fontSize={fontSizes.m}
                color="text.secondary"
                fontWeight="bold"
              >
                {t('form.taskType')}
              </Typography>
              <Typography
                fontSize={fontSizes.m}
                sx={{ mt: 2, wordWrap: 'break-word' }}
              >
                <Chip
                  sx={{ mt: 1 }}
                  label={ProblemType[problem.taskType]}
                  variant="outlined"
                  color={
                    ProblemType[problem.taskType] === 'Task 1'
                      ? 'primary'
                      : 'secondary'
                  }
                />
              </Typography>
            </Box>
            <Divider sx={{ mx: 3 }} />
            <Box
              sx={{
                p: 3,
                width: '100%',
              }}
            >
              <Typography
                fontSize={fontSizes.m}
                color="text.secondary"
                fontWeight="bold"
              >
                {t('form.question')}
              </Typography>
              <Typography sx={{ mt: 2, wordWrap: 'break-word' }}>
                {problem.question}
              </Typography>
            </Box>
            {problem.taskType === ProblemType1 && !!img && (
              <>
                <Divider sx={{ mx: 3 }} />
                <Box sx={{ p: 3 }}>
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
              </>
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
                onClick={() => moveAnswerPage()}
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
                            ? colors.base.black
                            : theme.palette.background.default,
                      }}
                      onClick={() => redeemOrReview(answer)}
                    >
                      <CardActionArea>
                        <CardContent>
                          <Chip
                            variant="outlined"
                            label={
                              answerStr[
                                answer.status as keyof typeof answerStr
                              ] === 'Completed'
                                ? t('detail.answer.list.completed')
                                : t('detail.answer.list.inProgress')
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
                                {`${t('detail.answer.list.lastAnswered')}: `}
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
                      {t('detail.answer.list.empty')}
                    </Typography>
                    <Button
                      color="primary"
                      variant="outlined"
                      onClick={() => moveAnswerPage()}
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
        destination: '/',
      },
    }
  }
}
