import React, { FC, useLayoutEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { AnswerForm } from '@/components/templates/problem/answer/AnswerForm'
import { answerStatus } from '@/constants/AnswerStatus'
import { Path } from '@/constants/Path'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { useSetBreadcrumbs } from '@/hooks/useSetBreadcrumbs'
import { answerService } from '@/services/answerService'
import { problemService } from '@/services/problemService'
import { commonSlice } from '@/store/common'
import { AnsweringForm } from '@/types/form/AnsweringForm'
import { Problem } from '@/types/model/problem'

export const Answer: FC = () => {
  const { amplifyUser } = useGetAuthUser()
  const { t } = useTranslation()
  const [problem, setProblem] = React.useState<Problem>()
  useSetBreadcrumbs([
    { label: t('Problem.list.title'), href: Path.Problem },
    {
      label: t('Problem.detail.title'),
      href: Path.ProblemDetail.replace(':problemId', problem?.id || ''),
    },
    { label: t('Answer.create.title'), href: undefined },
  ])
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()

  const methods = useForm<AnsweringForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  useLayoutEffect(() => {
    if (!amplifyUser) {
      return
    }
    if (!params.problemId) {
      return navigate(Path.Problem)
    }
    dispatch(commonSlice.actions.updateIsBackdropShow(true))
    problemService
      .getProblemById(params.problemId as string, amplifyUser)
      .then(({ problem }) => {
        setProblem(problem)
        methods.reset({
          status: answerStatus.inProgress,
          answer: '',
          time: problem.taskType === 'Type_#Task1' ? 20 : 40,
          countDownSec: 0,
        })
      })
      .catch(() => {
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

    if (!problem) {
      return
    }

    dispatch(commonSlice.actions.updateIsBackdropShow(true))
    const res = await answerService.createAnswer(problem.id, data, amplifyUser)
    dispatch(commonSlice.actions.updateIsBackdropShow(false))

    if (res) {
      navigate(Path.ProblemDetail.replace(':problemId', problem.id))
    }
  }

  return (
    <>
      {problem && (
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            style={{ width: '100%' }}
          >
            <AnswerForm problem={problem} handleSubmit={save} />
          </form>
        </FormProvider>
      )}
    </>
  )
}
