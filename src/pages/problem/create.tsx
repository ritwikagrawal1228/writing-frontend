import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import SaveIcon from '@mui/icons-material/Save'
import { Box, Button, Paper, useTheme } from '@mui/material'
import { Storage, withSSRContext } from 'aws-amplify'
import imageCompression from 'browser-image-compression'
import { gql } from 'graphql-request'
import { useTranslations } from 'next-intl'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'

import Layout from '@/components/templates/Layout'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { ProblemListForm } from '@/components/templates/problem/ProblemListForm'
import { Path } from '@/constants/Path'
import { CreateProblemForm } from '@/types/form/CreateProblemForm'
import { axios } from '@/utils/axios'

type Props = {
  userStr: string
  authenticated: boolean
}

export default function ProblemCreate({ authenticated, userStr }: Props) {
  const user = JSON.parse(userStr || '{}')
  const theme = useTheme()
  const t = useTranslations('Nav')
  const [photo, setPhoto] = useState<File | undefined>(undefined)
  const router = useRouter()

  const methods = useForm<CreateProblemForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const onSubmit: SubmitHandler<CreateProblemForm> = async (data) => {
    let key = ''
    if (photo) {
      const compPhoto = await imageCompression(photo, {
        maxSizeMB: 1,
      })
      const fileExt = compPhoto.name.split('.').pop()
      const res = await Storage.put(
        `${user.sub}-${Date.now()}.${fileExt}`,
        compPhoto,
        { level: 'protected' },
      )
      key = res.key
    }

    const uploadQuery = gql`
      mutation ($input: CreateProblemInput!) {
        createProblem(input: $input) {
          id
        }
      }
    `
    const variables = {
      input: {
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

    router.push(`${Path.Problem}/${res.data.createProblem.id}`)
  }

  return (
    <Layout
      title="Problems"
      description="a"
      breadcrumbs={[
        { label: 'Problem List', href: Path.Problem },
        { label: 'Problem Create', href: undefined },
      ]}
    >
      <TitleBox title="Problem Create">
        <Box sx={{ maxHeight: '36px' }}>
          <Button
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => methods.handleSubmit(onSubmit)()}
          >
            <b>保存</b>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context
  const { Auth } = withSSRContext({ req: context.req })

  try {
    const user = await Auth.currentAuthenticatedUser()

    return {
      props: {
        authenticated: true,
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
