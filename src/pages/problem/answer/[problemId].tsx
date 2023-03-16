import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import { withSSRContext } from 'aws-amplify'
import { useTranslations } from 'next-intl'
import { useDispatch } from 'react-redux'

import Layout from '@/components/templates/Layout'
import { AnswerForm } from '@/components/templates/problem/answer/AnswerForm'
import { AnswerStatus } from '@/constants/AnswerStatus'
import { Path } from '@/constants/Path'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { answerService } from '@/services/answerService'
import { problemService } from '@/services/problemService'
import { commonSlice } from '@/store/common'
import { Problem } from '@/types/model/problem'

type Props = {
  problem: Problem
  userStr: string
}

export default function Answer({ problem, userStr }: Props) {
  useGetAuthUser(userStr)
  const t = useTranslations('Problem')
  const ta = useTranslations('Answer')
  const router = useRouter()
  const [answer, setAnswer] = React.useState<string>('')
  const [time, setTime] = React.useState<number>(20)
  const [countDownSec, setCountDownSec] = React.useState<number>(0)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!problem) {
      return
    }

    // Set default time if answer doesn't have time
    const type = problem.taskType === 'Type_#Task1' ? 20 : 40
    setTime(type)
  }, [])

  const handleSubmit = async (isSave: boolean, status: AnswerStatus) => {
    if (!isSave) {
      router.push(`${Path.Problem}/${problem.id}`)
      return
    }

    dispatch(commonSlice.actions.updateIsBackdropShow(true))
    const res = await answerService.createAnswer(
      problem.id,
      answer,
      countDownSec,
      time,
      status,
    )
    dispatch(commonSlice.actions.updateIsBackdropShow(false))

    if (res) {
      router.push(`${Path.Problem}/${problem.id}`)
    }
  }

  return (
    <Layout
      title={`${ta('create.title')} | ${problem.title}`}
      description={ta('create.description')}
      breadcrumbs={[
        { label: t('list.title'), href: Path.Problem },
        { label: t('detail.title'), href: `${Path.Problem}/${problem.id}` },
        { label: ta('create.title'), href: undefined },
      ]}
    >
      <AnswerForm
        problem={problem}
        answer={answer}
        setAnswer={setAnswer}
        countDownSec={countDownSec}
        setCountDownSec={setCountDownSec}
        handleSubmit={handleSubmit}
        time={time}
        setTime={setTime}
      />
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

    const { problemId: id } = context.query
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
        destination: Path.Auth,
      },
    }
  }
}
