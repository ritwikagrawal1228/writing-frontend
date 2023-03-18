import React, { Fragment, useEffect } from 'react'

import AddIcon from '@mui/icons-material/Add'
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
  useTheme,
} from '@mui/material'
import { Storage } from 'aws-amplify'

import { TitleBox } from '@/components/templates/common/TitleBox'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { problemService } from '@/services/problemService'
import { colors, fontSizes } from '@/themes/globalStyles'
import { Problem } from '@/types/model/problem'
import { useTranslation } from 'react-i18next'
import { Path } from '@/constants/Path'
import { ProblemType } from '@/constants/ProblemType'
import { useNavigate } from 'react-router-dom'
import { useSetBreadcrumbs } from '@/hooks/useSetBreadcrumbs'

export const ProblemList = () => {
  const { user, amplifyUser } = useGetAuthUser()
  const theme = useTheme()
  const { t } = useTranslation()
  useSetBreadcrumbs([{ label: t('Problem.list.title') }])
  const [isProblemsLoading, setIsProblemsLoading] =
    React.useState<boolean>(true)
  const [problems, setProblems] = React.useState<Problem[]>([])
  const [images, setImages] = React.useState<{ id: string; src: string }[]>([])
  const navigate = useNavigate()

  const moveCreatePage = () => {
    navigate(Path.ProblemCreate)
  }

  const moveDetail = (problemId: string) => {
    navigate(Path.ProblemDetail.replace(':problemId', problemId))
  }

  useEffect(() => {
    if (!user) {
      return
    }
    problemService
      .getProblemsByUserId(amplifyUser)
      .then(({ problemsByUserId }) => {
        setProblems(problemsByUserId)
      })
      .finally(() => {
        setIsProblemsLoading(false)
      })
  }, [user])

  useEffect(() => {
    if (!problems || problems.length === 0) {
      return
    }

    problems.map((prob) => {
      if (prob.questionImageKey) {
        Storage.get(prob.questionImageKey).then((res) => {
          // update images src
          setImages((prev) => [...prev, { id: prob.id, src: res }])
        })
      }
    })
  }, [problems])

  return (
    <>
      <TitleBox title={t('Problem.list.title')}>
        <Box sx={{ maxHeight: '36px' }}>
          <Button
            color="primary"
            onClick={moveCreatePage}
            variant="contained"
            startIcon={<AddIcon />}
          >
            <b>{t('Problem.list.addBtn')}</b>
          </Button>
        </Box>
      </TitleBox>
      <Paper sx={{ minHeight: '460px', textAlign: 'center', p: 4 }}>
        {isProblemsLoading ? (
          <Box sx={{ p: 10 }}>
            <CircularProgress size={80} />
          </Box>
        ) : problems.length > 0 ? (
          <List
            sx={{
              width: '100%',
              bgcolor:
                theme.palette.mode === 'dark'
                  ? colors.base.gray
                  : colors.disabled.light,
              borderRadius: 1,
              py: 0,
            }}
          >
            {problems.map((problem: Problem, i: number) => (
              <Fragment key={problem.id}>
                <ListItem
                  alignItems="flex-start"
                  component="div"
                  disablePadding
                  secondaryAction={
                    <Chip
                      variant="outlined"
                      label={ProblemType[problem.taskType]}
                      color={
                        ProblemType[problem.taskType] === 'Task 1'
                          ? 'primary'
                          : 'secondary'
                      }
                    />
                  }
                >
                  <ListItemButton onClick={() => moveDetail(problem.id)}>
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        alt={problem.title}
                        src={
                          images.find((image) => image.id === problem.id)
                            ?.src || '/img/noImage.jpg'
                        }
                      />
                    </ListItemAvatar>
                    <ListItemText
                      sx={{ mr: 5 }}
                      primary={problem.title}
                      secondary={
                        <Fragment>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {problem.question}
                          </Typography>
                          <Typography fontSize={fontSizes.s} sx={{ mt: 1 }}>
                            {new Date(problem.createdAt).toLocaleDateString()}{' '}
                          </Typography>
                        </Fragment>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {problems[i + 1] && <Divider variant="inset" component="li" />}
              </Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 10 }}>
            <Typography variant="h6" fontWeight="bold">
              {t('Problem.list.empty')}
            </Typography>
            <br />
            <Button
              color="primary"
              onClick={moveCreatePage}
              variant="contained"
              startIcon={<AddIcon />}
            >
              <b>{t('Problem.list.addBtn')}</b>
            </Button>
          </Box>
        )}
      </Paper>
    </>
  )
}
