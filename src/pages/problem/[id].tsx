import React, {
  FC,
  Fragment,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import MoreVertIcon from '@mui/icons-material/MoreVert'
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
  Skeleton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { Storage } from 'aws-amplify'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { TitleBox } from '@/components/templates/common/TitleBox'
import { answerStatus, answerStr } from '@/constants/AnswerStatus'
import { Path } from '@/constants/Path'
import { ProblemType, ProblemType1 } from '@/constants/ProblemType'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { useSetBreadcrumbs } from '@/hooks/useSetBreadcrumbs'
import { answerService } from '@/services/answerService'
import { problemService } from '@/services/problemService'
import { RootState } from '@/store'
import { commonSlice } from '@/store/common'
import { colors, fontSizes } from '@/themes/globalStyles'
import { Answer } from '@/types/model/answer'
import { Problem } from '@/types/model/problem'
import { roundSentence } from '@/utils/roundSentence'

export const ProblemDetail: FC = () => {
  const { amplifyUser } = useGetAuthUser()
  const { t } = useTranslation()
  useSetBreadcrumbs([
    { label: t('Problem.list.title'), href: Path.Problem },
    { label: t('Problem.detail.title') },
  ])
  const lang = useSelector((state: RootState) => state.lang.lang)
  const navigate = useNavigate()
  const theme = useTheme()
  const params = useParams()
  const [problem, setProblem] = React.useState<Problem>()
  const [img, setImg] = React.useState<string | undefined>()
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [answerModels, setAnswerModels] = React.useState<Answer[]>([])
  const [isAnswerLoading, setIsAnswerLoading] = React.useState(false)
  const dispatch = useDispatch()

  const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null)
  const [anchorElAnswerMenu, setAnchorAnswerElMenu] =
    useState<null | HTMLElement>(null)
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMenu(event.currentTarget)
  }
  const handleOpenAnswerMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorAnswerElMenu(event.currentTarget)
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
  const handleCloseAnswerMenu = (aId?: string) => {
    if (aId) {
      confirmDeleteAnswer(aId)
    }

    setAnchorAnswerElMenu(null)
  }

  useLayoutEffect(() => {
    if (!amplifyUser) {
      return
    }
    if (!params.problemId) {
      dispatch(
        commonSlice.actions.updateSnackBar({
          isSnackbarShow: true,
          snackBarMsg: t('Common.errorOccurred'),
          snackBarType: 'error',
        }),
      )
      return navigate(Path.Problem)
    }
    problemService
      .getProblemById(params.problemId as string, amplifyUser)
      .then(({ problem }) => {
        setProblem(problem)
      })
      .catch(() => {
        dispatch(
          commonSlice.actions.updateSnackBar({
            isSnackbarShow: true,
            snackBarMsg: t('Common.errorOccurred'),
            snackBarType: 'error',
          }),
        )
        return navigate(Path.Problem)
      })
  }, [amplifyUser])

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

    getAnswers(problem)
  }, [problem])

  const getAnswers = (problem: Problem) => {
    setIsAnswerLoading(true)
    answerService
      .getAnswersByProblemId(problem.id, amplifyUser)
      .then(({ answersByProblemId }) => {
        setAnswerModels(answersByProblemId)
      })
      .finally(() => {
        setIsAnswerLoading(false)
      })
  }

  const moveEditPage = () => {
    if (!problem) {
      return
    }
    navigate(Path.ProblemEdit.replace(':problemId', problem.id))
  }

  const confirmDelete = () => {
    setIsAlertOpen(true)
  }

  const confirmDeleteAnswer = (aId: string) => {
    dispatch(
      commonSlice.actions.updateDialog({
        isDialogShow: true,
        titleText: t('Problem.detail.answer.list.deleteConfirmTitle'),
        contentText: t('Problem.detail.answer.list.deleteConfirmDescription'),
        cancelText: t('Problem.detail.answer.list.deleteConfirmCancelBtn'),
        actionText: t('Problem.detail.answer.list.deleteConfirmDeleteBtn'),
        onAction: (result?: boolean) => {
          if (!result) {
            return
          }
          dispatch(commonSlice.actions.updateIsBackdropShow(true))
          answerService
            .deleteAnswer(aId, amplifyUser)
            .then(() => {
              dispatch(
                commonSlice.actions.updateSnackBar({
                  isSnackbarShow: true,
                  snackBarMsg: t('Problem.detail.answer.list.deleteSuccess'),
                  snackBarType: 'success',
                }),
              )
              if (problem) {
                getAnswers(problem)
              }
            })
            .finally(() =>
              dispatch(commonSlice.actions.updateIsBackdropShow(false)),
            )
        },
      }),
    )
  }

  const handleAlertClose = () => {
    setIsAlertOpen(false)
  }

  const deleteProblem = async () => {
    if (!problem) {
      return
    }
    setIsAlertOpen(false)
    dispatch(commonSlice.actions.updateIsBackdropShow(true))

    await problemService
      .deleteProblemById(problem.id, amplifyUser)
      .then(() => {
        navigate(Path.Problem)
      })
      .catch((err) => {
        console.log(err)
      })
    dispatch(commonSlice.actions.updateIsBackdropShow(false))
  }

  const moveAnswerPage = () => {
    if (!problem) {
      return
    }
    navigate(Path.ProblemAnswer.replace(':problemId', problem.id))
  }

  const redeemOrReview = (answer: Answer) => {
    if (answer.status === answerStatus.completed) {
      navigate(Path.ProblemAnswerReview.replace(':answerId', answer.id))
    } else {
      navigate(Path.ProblemAnswerRedeem.replace(':answerId', answer.id))
    }
  }

  return (
    <>
      <Grid container columnSpacing={3}>
        <Grid item xs={5}>
          <TitleBox title={t('Problem.detail.title')}>
            <Box sx={{ maxHeight: '36px' }}>
              <Tooltip title="Open menu">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0 }}
                  disabled={!problem}
                >
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
                    <ListItemText primary={t('Problem.detail.editMenu')} />
                  </ListItemButton>
                  <ListItemButton onClick={() => handleCloseUserMenu('delete')}>
                    <ListItemIcon>
                      <DeleteForeverIcon />
                    </ListItemIcon>
                    <ListItemText primary={t('Problem.detail.deleteMenu')} />
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
                  {t('Problem.detail.deleteConfirmTitle')}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {t('Problem.detail.deleteConfirmDescription')}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    color="inherit"
                    variant="outlined"
                    onClick={handleAlertClose}
                  >
                    {t('Problem.detail.deleteConfirmCancelBtn')}
                  </Button>
                  <Button
                    onClick={() => deleteProblem()}
                    variant="contained"
                    autoFocus
                  >
                    {t('Problem.detail.deleteConfirmDeleteBtn')}
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </TitleBox>
          {problem ? (
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
                  {t('Problem.form.title')}
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
                  {t('Problem.form.taskType')}
                </Typography>
                <Typography
                  fontSize={fontSizes.m}
                  sx={{ mt: 2, wordWrap: 'break-word' }}
                >
                  <Chip
                    sx={{ mt: 1 }}
                    label={ProblemType[problem.taskType || 'Type_#Task1']}
                    variant="outlined"
                    color={
                      ProblemType[problem.taskType || 'Type_#Task1'] ===
                      'Task 1'
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
                  {t('Problem.form.question')}
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
                      {t('Problem.form.questionImage')}:{' '}
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
          ) : (
            <Skeleton variant="rounded" width="100%" height={700} />
          )}
        </Grid>
        <Grid item xs={7}>
          <TitleBox title={t('Problem.detail.answer.list.title')}>
            <Box sx={{ maxHeight: '36px' }}>
              <Button
                color="primary"
                variant="contained"
                startIcon={<BorderColorOutlinedIcon />}
                onClick={() => moveAnswerPage()}
                disabled={!problem}
              >
                <b>{t('Problem.detail.answer.list.addBtn')}</b>
              </Button>
            </Box>
          </TitleBox>
          {problem ? (
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
                    <Box sx={{ display: 'flex' }}>
                      <Card
                        sx={{
                          mb: 2,
                          width: '100%',
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
                                  ? t('Problem.detail.answer.list.completed')
                                  : t('Problem.detail.answer.list.inProgress')
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
                                  {`${t(
                                    'Problem.detail.answer.list.lastAnswered',
                                  )}: `}
                                  {answer.createdAt &&
                                    new Date(answer.updatedAt).toLocaleString(
                                      lang,
                                    )}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardActions>
                        </CardActionArea>
                      </Card>
                      <Tooltip title="Open menu">
                        <IconButton
                          onClick={handleOpenAnswerMenu}
                          sx={{ p: 0, height: '30px' }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                      <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElAnswerMenu}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        open={Boolean(anchorElAnswerMenu)}
                        onClose={() => handleCloseAnswerMenu()}
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
                          <ListItemButton
                            onClick={() => handleCloseAnswerMenu(answer.id)}
                          >
                            <ListItemIcon>
                              <DeleteForeverIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={t(
                                'Answer.review.tabContentMyReviewDeleteButton',
                              )}
                            />
                          </ListItemButton>
                        </List>
                      </Menu>
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
                        {t('Problem.detail.answer.list.empty')}
                      </Typography>
                      <Button
                        color="primary"
                        variant="outlined"
                        onClick={() => moveAnswerPage()}
                      >
                        <b>{t('Problem.detail.answer.list.addBtn')}</b>
                      </Button>
                    </>
                  )}
                </Box>
              )}
            </Paper>
          ) : (
            <Skeleton variant="rounded" width="100%" height={700} />
          )}
        </Grid>
      </Grid>
    </>
  )
}
