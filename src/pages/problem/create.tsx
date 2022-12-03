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
import { problemService } from '@/services/problemService'
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
  const t = useTranslations('Problem')
  const [photo, setPhoto] = useState<File | undefined>(undefined)
  const router = useRouter()
  const [limitAlert, setLimitAlert] = useState(false)

  const { data: res } = useSWR<ProblemsByUserId>(user?.id, (userId) =>
    problemService.getProblemsByUserId(userId),
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
        if (err.response?.data === 'PROBLEM_COUNT_LIMIT') {
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

  const getAlertWarningTitle = (): React.ReactNode => {
    const limit =
      (res?.data?.problemsByUserId && res?.data?.problemsByUserId.length) || 0

    let text: React.ReactNode
    switch (router.locale) {
      case 'en':
        text = (
          <>
            You can create <strong>{10 - limit}</strong> more questions!
          </>
        )
        break
      case 'ja':
        text = (
          <>
            あと<strong>{10 - limit}</strong>問作成できます！
          </>
        )
        break
      default:
        break
    }

    return text
  }

  return (
    <Layout
      title={t('create.title')}
      description={t('create.title')}
      breadcrumbs={[
        { label: t('list.title'), href: Path.Problem },
        { label: t('create.title'), href: undefined },
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
          {t('create.limitAlertSnackbarTitle')}
        </Alert>
      </Snackbar>
      <TitleBox title={t('create.title')}>
        <Box sx={{ maxHeight: '36px' }}>
          <Button
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => methods.handleSubmit(onSubmit)()}
            disabled={
              user?.plan === 'FREE' &&
              res?.data.problemsByUserId &&
              res.data.problemsByUserId.length >= 10
            }
          >
            <b>{t('create.submitBtn')}</b>
          </Button>
        </Box>
      </TitleBox>
      {user?.plan === 'FREE' && res?.data.problemsByUserId && (
        <>
          {res.data.problemsByUserId.length >= 10 ? (
            <>
              <Alert severity="error">
                <AlertTitle>
                  <strong>{t('create.limitAlertTitle')}</strong>
                </AlertTitle>
                {t('create.limitAlertContent1')}
                <br />
                {t('create.limitAlertContent2')}{' '}
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
                <AlertTitle>{getAlertWarningTitle()}</AlertTitle>
                {t('create.limitAlertContent1')}
                <br />
                {t('create.limitAlertContent2')}{' '}
                <Link href={Path.Purchase}>
                  <u style={{ color: 'link' }}>{t('create.upgradeLink')}</u>
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
            <ProblemListForm
              photo={photo}
              setPhoto={setPhoto}
              locale={router.locale}
            />
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
