import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import {
  Backdrop,
  Box,
  Button,
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
} from '@mui/material'
import { Storage, withSSRContext } from 'aws-amplify'
import { useTranslations } from 'next-intl'

import Layout from '@/components/templates/Layout'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { Path } from '@/constants/Path'
import { ProblemType } from '@/constants/ProblemType'
import { postService } from '@/services/postService'
import { colors, fontSizes } from '@/themes/globalStyles'
import { Problem } from '@/types/model/problem'

type Props = {
  problem: Problem
  userStr: string
}

export default function ProblemDetail({ problem, userStr }: Props) {
  const user = JSON.parse(userStr || '{}')
  const t = useTranslations('Problem')
  const router = useRouter()
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

    postService
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

  return (
    <Layout
      title={problem.title}
      description={problem.question}
      breadcrumbs={[
        { label: 'Problem List', href: Path.Problem },
        { label: 'Problem Detail', href: undefined },
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
          <TitleBox title="Problem Detail">
            <Box sx={{ maxHeight: '36px' }}>
              <Button
                color="primary"
                variant="outlined"
                startIcon={<DeleteForeverIcon />}
                sx={{ mr: 2 }}
                onClick={() => confirmDelete()}
              >
                <b>Delete</b>
              </Button>
              <Dialog
                open={isAlertOpen}
                onClose={handleAlertClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  Are you sure you want to delete this problem?
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    You can not undo this action. <br /> Deleted problems will
                    be permanently deleted.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button color="inherit" onClick={handleAlertClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => deleteProblem(problem.id)}
                    variant="contained"
                    autoFocus
                  >
                    delete
                  </Button>
                </DialogActions>
              </Dialog>
              <Button
                color="secondary"
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => moveEditPage(problem.id)}
              >
                <b>Edit</b>
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
                Title:{' '}
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
                Type:{' '}
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
                Question:{' '}
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
                Question Image:{' '}
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
          <TitleBox title="Answer List">
            <Box sx={{ maxHeight: '36px' }}>
              <Button
                color="primary"
                variant="contained"
                startIcon={<BorderColorOutlinedIcon />}
              >
                <b>Answer</b>
              </Button>
            </Box>
          </TitleBox>
          <Paper sx={{ width: '100%', minHeight: '600px' }}></Paper>
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
