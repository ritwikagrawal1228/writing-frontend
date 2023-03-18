import React, { FC, useCallback, useEffect, useLayoutEffect } from 'react'

import { withSSRContext } from 'aws-amplify'
import { useDispatch, useSelector } from 'react-redux'

import Layout from '@/components/templates/Layout'
import { AnswerForm } from '@/components/templates/problem/answer/AnswerForm'
import { AnswerStatus, answerStatus } from '@/constants/AnswerStatus'
import { Path } from '@/constants/Path'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { answerService } from '@/services/answerService'
import { problemService } from '@/services/problemService'
import { commonSlice } from '@/store/common'
import { Problem } from '@/types/model/problem'
import { useTranslation } from 'react-i18next'
import { useSetBreadcrumbs } from '@/hooks/useSetBreadcrumbs'
import { useNavigate, useParams } from 'react-router-dom'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { usePrompt } from '@/hooks/usePrompt'
import { AnsweringForm } from '@/types/form/AnsweringForm'
import { Answer } from '@/types/model/answer'
import { ProblemType1 } from '@/constants/ProblemType'

export const AnswerRedeem: FC = () => {
  const { user, amplifyUser } = useGetAuthUser()
  const { t } = useTranslation()
  const [answer, setAnswer] = React.useState<Answer>()
  useSetBreadcrumbs([
    { label: t('Problem.list.title'), href: Path.Problem },
    {
      label: t('Problem.detail.title'),
      href: Path.ProblemDetail.replace(':problemId', answer?.problem.id || ''),
    },
    { label: t('Answer.create.title'), href: undefined },
  ])
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()

  const methods = useForm<AnsweringForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: false,
  })

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
        methods.reset({
          answer: answer.answer,
          countDownSec: answer.answerSpentTime,
          status: answerStatus.inProgress,
          time: answer.time
            ? answer.time
            : answer.problem.taskType === ProblemType1
            ? 20
            : 40,
        })
      })
      .catch((err) => {
        console.error(err)
        return navigate(Path.Problem)
      })
      .finally(() => dispatch(commonSlice.actions.updateIsBackdropShow(false)))
  }, [amplifyUser])

  const save = () => {
    methods.handleSubmit(onSubmit)()
  }

  const onSubmit: SubmitHandler<AnsweringForm> = async (data) => {
    if (!data.answer) {
      dispatch(
        commonSlice.actions.updateSnackBar({
          isSnackbarShow: true,
          snackBarMsg: t('Answer.form.emptyAnswer'),
          snackBarType: 'error',
        }),
      )
      return
    }

    if (!answer) {
      return
    }

    dispatch(commonSlice.actions.updateIsBackdropShow(true))
    const res = await answerService.updateAnswer(
      answer.id,
      answer.problem.id,
      data,
      amplifyUser,
    )
    dispatch(commonSlice.actions.updateIsBackdropShow(false))

    if (res) {
      navigate(Path.ProblemDetail.replace(':problemId', answer.problem.id))
    }
  }

  return (
    <>
      {answer?.problem && (
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            style={{ width: '100%' }}
          >
            <AnswerForm problem={answer.problem} handleSubmit={save} />
          </form>
        </FormProvider>
      )}
    </>
  )
}
