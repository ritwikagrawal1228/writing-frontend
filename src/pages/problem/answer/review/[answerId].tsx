import React, { useEffect, useLayoutEffect } from 'react'

import {
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { Storage, withSSRContext } from 'aws-amplify'

import Layout from '@/components/templates/Layout'
import { ProblemDisplayPaper } from '@/components/templates/common/ProblemDisplayPaper'
import { AnswerArea } from '@/components/templates/problem/answer/review/AnswerArea'
import { ReviewArea } from '@/components/templates/problem/answer/review/ReviewArea'
import { Path } from '@/constants/Path'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { answerService } from '@/services/answerService'
import { fontSizes } from '@/themes/globalStyles'
import { Answer } from '@/types/model/answer'
import { useTranslation } from 'react-i18next'
import { useSetBreadcrumbs } from '@/hooks/useSetBreadcrumbs'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { commonSlice } from '@/store/common'

interface Column {
  id: 'type' | 'words' | 'time' | 'answerSpentTime' | 'wordCount'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

export const AnswerReview = () => {
  const { user, amplifyUser } = useGetAuthUser()
  const { t } = useTranslation()
  const [answer, setAnswer] = React.useState<Answer>()
  useSetBreadcrumbs([
    { label: t('Problem.list.title'), href: Path.Problem },
    {
      label: t('Problem.detail.title'),
      href: Path.ProblemDetail.replace(':problemId', answer?.problem.id || ''),
    },
    { label: t('Answer.review.title'), href: undefined },
  ])
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  const [img, setImg] = React.useState<string | undefined>()
  const [isDiffView, setIsDiffView] = React.useState<boolean>(true)
  const columns: readonly Column[] = [
    { id: 'type', label: t('Answer.review.colPart'), minWidth: 100 },
    { id: 'words', label: t('Answer.review.colWords'), minWidth: 100 },
    { id: 'wordCount', label: t('Answer.review.colWordCount'), minWidth: 100 },
    { id: 'time', label: t('Answer.review.colTime'), minWidth: 100 },
    {
      id: 'answerSpentTime',
      label: t('Answer.review.colSpentTime'),
      minWidth: 100,
    },
  ]

  useLayoutEffect(() => {
    if (!amplifyUser) {
      return
    }
    if (!params.answerId) {
      return navigate(Path.Problem)
    }
    dispatch(commonSlice.actions.updateIsBackdropShow(true))
    answerService
      .getAnswerById(params.answerId as string, amplifyUser)
      .then(({ answer }) => {
        setAnswer(answer)
      })
      .catch((err) => {
        console.error(err)
        return navigate(Path.Problem)
      })
      .finally(() => dispatch(commonSlice.actions.updateIsBackdropShow(false)))
  }, [amplifyUser])

  useEffect(() => {
    if (answer?.problem.questionImageKey) {
      Storage.get(answer?.problem.questionImageKey)
        .then((res) => {
          setImg(res)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }, [answer?.problem])

  const handleViewChange = async () => {
    setIsDiffView(!isDiffView)
  }

  const padTo2Digits = (num: number) => {
    return num.toString().padStart(2, '')
  }

  return (
    <>
      {answer && (
        <>
          <Grid container alignItems="center">
            <Grid item xs={12}>
              <Typography fontSize={fontSizes.xxl} fontWeight="bold">
                {answer.problem.title}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            alignItems="center"
            sx={{ mb: 2, mt: 1 }}
            rowSpacing={2}
          >
            <Grid item xs={12}>
              <Paper>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell>
                          {answer.problem.taskType === 'Type_#Task1'
                            ? 'Part1'
                            : 'Part2'}
                        </TableCell>
                        <TableCell>
                          {answer.problem.taskType === 'Type_#Task1'
                            ? 150
                            : 250}{' '}
                          {t('Answer.review.wordUnit')}
                        </TableCell>
                        <TableCell>
                          {answer.answer
                            ? answer.answer.trim().split(/\s+/).length
                            : 0}{' '}
                          {t('Answer.review.wordUnit')}
                        </TableCell>
                        <TableCell>
                          {answer.time + t('Answer.review.minUnit')}{' '}
                        </TableCell>
                        <TableCell>
                          {answer.answerSpentTime !== 0
                            ? `${
                                padTo2Digits(
                                  Math.floor(answer.answerSpentTime / 60),
                                ) + t('Answer.review.minUnit')
                              } ${
                                padTo2Digits(answer.answerSpentTime % 60) +
                                t('Answer.review.secUnit')
                              }`
                            : '--'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <ReviewArea answer={answer} user={user} />
            </Grid>
          </Grid>
          <Grid container columnSpacing={2} sx={{ pb: 4 }}>
            <Grid item xs={6}>
              <ProblemDisplayPaper problem={answer.problem} img={img} />
            </Grid>
            <Grid item xs={6}>
              <Paper
                sx={{
                  p: 3,
                  width: '100%',
                  minHeight: '600px',
                  lineHeight: '40px',
                }}
              >
                <FormControlLabel
                  control={
                    <Switch checked={isDiffView} onChange={handleViewChange} />
                  }
                  label={t('Answer.review.answerDiffToggle')}
                  sx={{ mb: 2 }}
                />
                <Divider />
                {isDiffView ? (
                  <AnswerArea
                    answerSentences={answer.completedAnswerSentences}
                    answerId={answer.id}
                  />
                ) : (
                  <>
                    <Typography variant="h6" fontWeight="bold" sx={{ my: 2 }}>
                      {t('Answer.review.answerTitle')}
                    </Typography>
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                      {answer.answer}
                    </Typography>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </>
  )
}
