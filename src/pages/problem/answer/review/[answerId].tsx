import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import {
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
}

interface Column {
  id: 'type' | 'words' | 'time' | 'answerSpentTime' | 'wordCount'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'type', label: 'Part', minWidth: 100 },
  { id: 'words', label: 'Minimum Words', minWidth: 100 },
  { id: 'time', label: 'Time Limit', minWidth: 100 },
  { id: 'answerSpentTime', label: 'Spent time', minWidth: 100 },
  { id: 'wordCount', label: 'Word Count', minWidth: 100 },
]

export default function AnswerReview({ answerModel, userStr }: Props) {
  const { user } = useGetAuthUser(userStr)
  const t = useTranslations('Problem')
  const ta = useTranslations('Answer')
  const router = useRouter()
  const [img, setImg] = React.useState<string | undefined>()

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

  const handleSubmit = async (isSave: boolean) => {
    //
  }

  const padTo2Digits = (num: number) => {
    return num.toString().padStart(2, '')
  }

  return (
    <Layout
      title={answerModel.problem.title}
      description={answerModel.problem.question}
      breadcrumbs={[
        { label: t('list.title'), href: Path.Problem },
        {
          label: t('detail.title'),
          href: `${Path.Problem}/${answerModel.problem.id}`,
        },
        { label: 'Review Answer', href: undefined },
      ]}
    >
      <Grid container alignItems="center">
        <Grid item xs={12}>
          <Typography fontSize={fontSizes.xxl} fontWeight="bold">
            {answerModel.problem.title}
          </Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center" sx={{ my: 2 }} rowSpacing={2}>
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
                        : 250}
                    </TableCell>
                    <TableCell>{answerModel.time} min</TableCell>
                    <TableCell>
                      {answerModel.answerSpentTime !== 0
                        ? `${padTo2Digits(
                            Math.floor(answerModel.answerSpentTime / 60),
                          )}min ${padTo2Digits(
                            answerModel.answerSpentTime % 60,
                          )}sec`
                        : '--'}
                    </TableCell>
                    <TableCell>
                      {answerModel.answer
                        ? answerModel.answer.trim().split(/\s+/).length
                        : 0}{' '}
                      words
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
            <AnswerArea
              answerSentences={answerModel.completedAnswerSentences}
              answerId={answerModel.id}
            />
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
