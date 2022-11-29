import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import SaveIcon from '@mui/icons-material/Save'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Paper,
  Snackbar,
  useTheme,
} from '@mui/material'
import { Storage, withSSRContext } from 'aws-amplify'
import imageCompression from 'browser-image-compression'
import { gql } from 'graphql-request'
import { useTranslations } from 'next-intl'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import useSWR from 'swr'

import Layout from '@/components/templates/Layout'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { ProblemListForm } from '@/components/templates/problem/ProblemListForm'
import { Path } from '@/constants/Path'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { postService } from '@/services/postService'
import { CreateProblemForm } from '@/types/form/CreateProblemForm'
import { Problem } from '@/types/model/problem'
import { axios } from '@/utils/axios'

type Props = {
  userStr: string
  authenticated: boolean
}

type ProblemsByUserId = {
  data: {
    problemsByUserId: Problem[] | []
  }
}

export default function ProblemCreate({ authenticated, userStr }: Props) {
  const { user } = useGetAuthUser(userStr)
  const theme = useTheme()
  const t = useTranslations('Nav')
  const [photo, setPhoto] = useState<File | undefined>(undefined)
  const router = useRouter()
  const [limitAlert, setLimitAlert] = useState(false)

  const { data: res } = useSWR<ProblemsByUserId>(user?.id, (userId) =>
    postService.getProblemsByUserId(userId),
  )

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
        `${user?.id}-${Date.now()}.${fileExt}`,
        compPhoto,
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
        userId: user?.id,
        title: data.title,
        taskType: data.taskType,
        question: data.question,
        questionImageKey: key,
      },
    }

    await axios
      .post(Path.APIGraphql, {
        query: uploadQuery,
        variables,
      })
      .then((res) => {
        router.push(`${Path.Problem}/${res.data.createProblem.id}`)
      })
      .catch((err) => {
        if (err.response.data === 'PROBLEM_COUNT_LIMIT') {
          setLimitAlert(true)
        }
      })
  }

  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setLimitAlert(false)
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
      <Snackbar
        open={limitAlert}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity="error"
          sx={{ width: '100%' }}
        >
          You need to upgrade your plan to create more problems.
        </Alert>
      </Snackbar>
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
      {user?.plan === 'FREE' && res?.data.problemsByUserId && (
        <>
          {res.data.problemsByUserId.length >= 10 ? (
            <>
              <Alert severity="error">
                <AlertTitle>
                  <strong>You can not create a problem!</strong>
                </AlertTitle>
                In the free plan, you can save up to 10 questions. <br />
                If you want to save more questions, please upgrade to the paid
                plan{' '}
                <Link href={Path.Purchase}>
                  <u style={{ color: 'link' }}>here</u>
                </Link>
                .
              </Alert>
              <br />
            </>
          ) : res.data?.problemsByUserId.length < 10 ? (
            <>
              <Alert
                severity={
                  10 - res.data.problemsByUserId.length > 3 ? 'info' : 'warning'
                }
              >
                <AlertTitle>
                  You can create{' '}
                  <strong>{10 - res.data.problemsByUserId.length}</strong> more
                  questions!
                </AlertTitle>
                In the free plan, you can save up to 10 questions. <br />
                If you want to save more questions, please upgrade to the paid
                plan{' '}
                <Link href={Path.Purchase}>
                  <u style={{ color: 'blue' }}>here</u>
                </Link>
                .
              </Alert>
              <br />
            </>
          ) : null}
        </>
      )}
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
