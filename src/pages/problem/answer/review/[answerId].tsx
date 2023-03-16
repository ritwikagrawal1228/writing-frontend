import { GetServerSidePropsContext } from 'next'
import React, { useEffect } from 'react'

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
import { useTranslations } from 'next-intl'

import Layout from '@/components/templates/Layout'
import { ProblemDisplayPaper } from '@/components/templates/common/ProblemDisplayPaper'
import { AnswerArea } from '@/components/templates/problem/answer/review/AnswerArea'
import { ReviewArea } from '@/components/templates/problem/answer/review/ReviewArea'
import { Path } from '@/constants/Path'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { answerService } from '@/services/answerService'
import { fontSizes } from '@/themes/globalStyles'
import { Answer } from '@/types/model/answer'

type Props = {
  answerModel: Answer
  userStr: string
  grammarlyClientId: string
}

interface Column {
  id: 'type' | 'words' | 'time' | 'answerSpentTime' | 'wordCount'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

export default function AnswerReview({
  answerModel,
  userStr,
  grammarlyClientId,
}: Props) {
  const { user } = useGetAuthUser(userStr)
  const t = useTranslations('Problem')
  const ta = useTranslations('Answer')
  const [img, setImg] = React.useState<string | undefined>()
  const [isDiffView, setIsDiffView] = React.useState<boolean>(true)
  const columns: readonly Column[] = [
    { id: 'type', label: ta('review.colPart'), minWidth: 100 },
    { id: 'words', label: ta('review.colWords'), minWidth: 100 },
    { id: 'wordCount', label: ta('review.colWordCount'), minWidth: 100 },
    { id: 'time', label: ta('review.colTime'), minWidth: 100 },
    { id: 'answerSpentTime', label: ta('review.colSpentTime'), minWidth: 100 },
  ]

  useEffect(() => {
    if (answerModel.problem.questionImageKey) {
      Storage.get(answerModel.problem.questionImageKey)
        .then((res) => {
          setImg(res)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }, [answerModel.problem])

  const handleViewChange = async () => {
    setIsDiffView(!isDiffView)
  }

  const padTo2Digits = (num: number) => {
    return num.toString().padStart(2, '')
  }

  return (
    <Layout
      title={`${ta('review.title')} | ${answerModel.problem.title}`}
      description={ta('review.description')}
      breadcrumbs={[
        { label: t('list.title'), href: Path.Problem },
        {
          label: t('detail.title'),
          href: `${Path.Problem}/${answerModel.problem.id}`,
        },
        { label: ta('review.title'), href: undefined },
      ]}
    >
      <Grid container alignItems="center">
        <Grid item xs={12}>
          <Typography fontSize={fontSizes.xxl} fontWeight="bold">
            {answerModel.problem.title}
          </Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center" sx={{ mb: 2, mt: 1 }} rowSpacing={2}>
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
                      {answerModel.problem.taskType === 'Type_#Task1'
                        ? 'Part1'
                        : 'Part2'}
                    </TableCell>
                    <TableCell>
                      {answerModel.problem.taskType === 'Type_#Task1'
                        ? 150
                        : 250}{' '}
                      {ta('review.wordUnit')}
                    </TableCell>
                    <TableCell>
                      {answerModel.answer
                        ? answerModel.answer.trim().split(/\s+/).length
                        : 0}{' '}
                      {ta('review.wordUnit')}
                    </TableCell>
                    <TableCell>
                      {answerModel.time + ta('review.minUnit')}{' '}
                    </TableCell>
                    <TableCell>
                      {answerModel.answerSpentTime !== 0
                        ? `${
                            padTo2Digits(
                              Math.floor(answerModel.answerSpentTime / 60),
                            ) + ta('review.minUnit')
                          } ${
                            padTo2Digits(answerModel.answerSpentTime % 60) +
                            ta('review.secUnit')
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
          <ReviewArea answer={answerModel} user={user} />
        </Grid>
      </Grid>
      <Grid container columnSpacing={2} sx={{ pb: 4 }}>
        <Grid item xs={6}>
          <ProblemDisplayPaper problem={answerModel.problem} img={img} />
        </Grid>
        <Grid item xs={6}>
          <Paper
            sx={{ p: 3, width: '100%', minHeight: '600px', lineHeight: '40px' }}
          >
            <FormControlLabel
              control={
                <Switch checked={isDiffView} onChange={handleViewChange} />
              }
              label={ta('review.answerDiffToggle')}
              sx={{ mb: 2 }}
            />
            <Divider />
            {isDiffView ? (
              <AnswerArea
                answerSentences={answerModel.completedAnswerSentences}
                answerId={answerModel.id}
                grammarlyClientId={grammarlyClientId}
              />
            ) : (
              <>
                <Typography variant="h6" fontWeight="bold" sx={{ my: 2 }}>
                  {ta('review.answerTitle')}
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                  {answerModel.answer}
                </Typography>
              </>
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

    const { answerId: id } = context.query
    if (typeof id !== 'string') {
      return { notFound: true }
    }

    const result = await answerService.getAnswerById(id, user)

    return {
      props: {
        answerModel: result.answer,
        userStr: JSON.stringify(user.attributes),
        messages: require(`@/locales/${locale}.json`),
        grammarlyClientId: process.env.GRAMMARLY_CLIENT_ID,
      },
    }
  } catch (err) {
    console.error(err)
    return {
      redirect: {
        permanent: false,
        destination: Path.Auth,
      },
    }
  }
}
