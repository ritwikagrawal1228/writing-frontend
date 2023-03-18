import React, { useEffect, useLayoutEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import SaveIcon from '@mui/icons-material/Save'
import { Box, Button, Paper, Skeleton } from '@mui/material'
import { Storage } from 'aws-amplify'
import imageCompression from 'browser-image-compression'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { TitleBox } from '@/components/templates/common/TitleBox'
import { ProblemListForm } from '@/components/templates/problem/ProblemListForm'
import { Path } from '@/constants/Path'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { useSetBreadcrumbs } from '@/hooks/useSetBreadcrumbs'
import { problemService } from '@/services/problemService'
import { commonSlice } from '@/store/common'
import { CreateProblemForm } from '@/types/form/CreateProblemForm'
import { Problem } from '@/types/model/problem'

export const ProblemEdit = () => {
  const { user, amplifyUser } = useGetAuthUser()
  const { t } = useTranslation()
  const [problem, setProblem] = React.useState<Problem>()
  useSetBreadcrumbs([
    { label: t('Problem.list.title'), href: Path.Problem },
    {
      label: t('Problem.detail.title'),
      href: Path.ProblemDetail.replace(':problemId', problem?.id || ''),
    },
    { label: t('Problem.edit.title'), href: undefined },
  ])
  const navigate = useNavigate()
  const params = useParams()
  const [photo, setPhoto] = React.useState<string | File | undefined>()
  const methods = useForm<CreateProblemForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  })
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    if (!amplifyUser) {
      return
    }
    if (!params.problemId) {
      return navigate(Path.Problem)
    }
    problemService
      .getProblemById(params.problemId as string, amplifyUser)
      .then(({ problem }) => {
        setProblem(problem)
      })
      .catch(() => {
        return navigate(Path.Problem)
      })
  }, [amplifyUser])

  useEffect(() => {
    if (!problem) {
      return
    }
    methods.reset({
      title: problem.title,
      taskType: problem.taskType,
      question: problem.question,
    })
    if (problem.questionImageKey) {
      Storage.get(problem.questionImageKey)
        .then((res) => {
          setPhoto(res)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }, [problem])

  const onSubmit: SubmitHandler<CreateProblemForm> = async (form) => {
    if (!problem || !user) {
      return
    }
    dispatch(commonSlice.actions.updateIsBackdropShow(true))
    let key = ''
    if (photo && typeof photo !== 'string') {
      if (problem.questionImageKey) {
        await Storage.remove(problem.questionImageKey)
      }

      const compPhoto = await imageCompression(photo, {
        maxSizeMB: 1,
      })
      const fileExt = compPhoto.name.split('Problem..').pop()

      const res = await Storage.put(
        `${user?.id}-${Date.now()}.${fileExt}`,
        compPhoto,
      )
      key = res.key
    } else if (photo && typeof photo === 'string') {
      key = problem.questionImageKey || ''
    }

    const { updateProblem } = await problemService.updateProblem(
      problem.id,
      form,
      key,
      amplifyUser,
    )
    dispatch(commonSlice.actions.updateIsBackdropShow(false))

    navigate(Path.ProblemDetail.replace(':problemId', updateProblem.id))
  }

  return (
    <>
      <TitleBox title={t('Problem.edit.title')}>
        <Box sx={{ maxHeight: '36px' }}>
          <Button
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => methods.handleSubmit(onSubmit)()}
          >
            <b>{t('Problem.edit.submitBtn')}</b>
          </Button>
        </Box>
      </TitleBox>
      {problem ? (
        <Paper sx={{ px: 5, py: 3, pb: 5 }}>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              style={{ width: '100%' }}
            >
              <ProblemListForm photo={photo} setPhoto={setPhoto} />
            </form>
          </FormProvider>
        </Paper>
      ) : (
        <Skeleton sx={{ px: 0 }} height={400} width="100%" />
      )}
    </>
  )
}
