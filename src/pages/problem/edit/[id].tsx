import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import SaveIcon from '@mui/icons-material/Save'
import { Box, Button, Paper } from '@mui/material'
import { Storage, withSSRContext } from 'aws-amplify'
import imageCompression from 'browser-image-compression'
import { gql } from 'graphql-request'
import { useTranslations } from 'next-intl'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'

import Layout from '@/components/templates/Layout'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { ProblemListForm } from '@/components/templates/problem/ProblemListForm'
import { Path } from '@/constants/Path'
import { postService } from '@/services/postService'
import { CreateProblemForm } from '@/types/form/CreateProblemForm'
import { Problem } from '@/types/model/problem'
import { axios } from '@/utils/axios'

type Props = {
  problem: Problem
  userStr: string
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

export default function ProblemEdit({ problem, userStr }: Props) {
  const user = JSON.parse(userStr || '{}')
  const t = useTranslations('Problem')
  const router = useRouter()
  const [photo, setPhoto] = React.useState<string | File | undefined>()
  const methods = useForm<CreateProblemForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

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

  const onSubmit: SubmitHandler<CreateProblemForm> = async (data) => {
    let key = ''
    if (photo && typeof photo !== 'string') {
      if (problem.questionImageKey) {
        await Storage.remove(problem.questionImageKey)
      }

      const compPhoto = await imageCompression(photo, {
        maxSizeMB: 1,
      })
      const fileExt = compPhoto.name.split('.').pop()

      const res = await Storage.put(
        `${user.sub}-${Date.now()}.${fileExt}`,
        compPhoto,
      )
      key = res.key
    } else if (photo && typeof photo === 'string') {
      key = problem.questionImageKey || ''
    }

    const uploadQuery = gql`
      mutation ($input: UpdateProblemInput!) {
        updateProblem(input: $input) {
          id
        }
      }
    `
    const variables = {
      input: {
        problemId: problem.id,
        userId: user.sub,
        title: data.title,
        taskType: data.taskType,
        question: data.question,
        questionImageKey: key,
      },
    }

    const res = await axios.post(Path.APIGraphql, {
      query: uploadQuery,
      variables,
    })

    router.push(`${Path.Problem}/${res.data.updateProblem.id}`)
  }

  return (
    <Layout
      title="Problems"
      description="a"
      breadcrumbs={[
        { label: 'Problem List', href: Path.Problem },
        { label: 'Problem Detail', href: `${Path.Problem}/${problem.id}` },
        { label: 'Problem Edit', href: undefined },
      ]}
    >
      <TitleBox title="Problem Edit">
        <Box sx={{ maxHeight: '36px' }}>
          <Button
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => methods.handleSubmit(onSubmit)()}
          >
            <b>Update</b>
          </Button>
        </Box>
      </TitleBox>
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
    </Layout>
  )
}
