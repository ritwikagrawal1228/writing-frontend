import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import { withSSRContext } from 'aws-amplify'
import { useTranslations } from 'next-intl'

import Layout from '@/components/templates/Layout'
import { AnswerForm } from '@/components/templates/problem/answer/AnswerForm'
import { AnswerStatus } from '@/constants/AnswerStatus'
import { Path } from '@/constants/Path'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { answerService } from '@/services/answerService'
import { Answer } from '@/types/model/answer'

type Props = {
  answerModel: Answer
  userStr: string
}

export default function AnswerRedeem({ answerModel, userStr }: Props) {
  const { user } = useGetAuthUser(userStr)
  const t = useTranslations('Problem')
  const ta = useTranslations('Answer')
  const router = useRouter()
  const [answer, setAnswer] = React.useState<string>(answerModel.answer || '')
  const [time, setTime] = React.useState<number>(answerModel.time)
  const [countDownSec, setCountDownSec] = React.useState<number>(
    answerModel.answerSpentTime,
  )

  useEffect(() => {
    if (!answerModel) {
      return
    }
    if (answerModel.time > 0) {
      return
    }

    // Set default time if answer doesn't have time
    const type = answerModel.problem.taskType === 'Type_#Task1' ? 20 : 40
    setTime(type)
  }, [answerModel])

  const handleSubmit = async (isSave: boolean, status: AnswerStatus) => {
    if (!isSave) {
      router.push(`${Path.Problem}/${answerModel.problem.id}`)
      return
    }

    const res = await answerService.updateAnswer(
      answerModel.id,
      answerModel.problem.id,
      answer,
      countDownSec,
      time,
      status,
    )

    if (res) {
      router.push(`${Path.Problem}/${answerModel.problem.id}`)
    }
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
        { label: ta('create.title'), href: undefined },
      ]}
      user={user}
    >
      <AnswerForm
        problem={answerModel.problem}
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
