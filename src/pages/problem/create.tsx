import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import SaveIcon from '@mui/icons-material/Save'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Paper,
  Snackbar,
} from '@mui/material'
import { Storage } from 'aws-amplify'
import imageCompression from 'browser-image-compression'
import { useTranslations } from 'next-intl'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'

import Layout from '@/components/templates/Layout'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { ProblemListForm } from '@/components/templates/problem/ProblemListForm'
import { Path } from '@/constants/Path'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { problemService } from '@/services/problemService'
import { commonSlice } from '@/store/common'
import { CreateProblemForm } from '@/types/form/CreateProblemForm'

export default function ProblemCreate() {
  const { user } = useGetAuthUser()
  const t = useTranslations('Problem')
  const [photo, setPhoto] = useState<File | undefined>(undefined)
  const router = useRouter()
  const [problemsNum, setProblemsNum] = useState<number>(0)
  const [isProblemsLoading, setIsProblemsLoading] =
    React.useState<boolean>(true)
  const [limitAlert, setLimitAlert] = useState(false)
  const dispatch = useDispatch()
  const methods = useForm<CreateProblemForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      taskType: 'Type_#Task1',
    },
  })

  useEffect(() => {
    if (!user) {
      return
    }
    problemService
      .getProblemsByUserId(user)
      .then(({ data }) => {
        setProblemsNum(data.problemsByUserId.length)
      })
      .finally(() => {
        setIsProblemsLoading(false)
      })
  }, [user])

  const onSubmit: SubmitHandler<CreateProblemForm> = async (data) => {
    dispatch(commonSlice.actions.updateIsBackdropShow(true))

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

    problemService
      .createProblem(data, key)
      .then(({ data }) => {
        router.push(`${Path.Problem}/${data.createProblem.id}`)
      })
      .catch((err) => {
        if (err.response?.data === 'PROBLEM_COUNT_LIMIT') {
          setLimitAlert(true)
        }
      })
      .finally(() => dispatch(commonSlice.actions.updateIsBackdropShow(false)))
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
    const limit = problemsNum || 0

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
            disabled={user?.plan === 'FREE' && problemsNum >= 10}
          >
            <b>{t('create.submitBtn')}</b>
          </Button>
        </Box>
      </TitleBox>
      {user?.plan === 'FREE' && (
        <>
          {problemsNum >= 10 ? (
            <>
              <Alert severity="error">
                <AlertTitle>
                  <strong>{t('create.limitAlertTitle')}</strong>
                </AlertTitle>
                {t('create.limitAlertContent1')}
                <br />
                {t('create.limitAlertContent2')}{' '}
                <Link href={Path.PaymentSubscription}>
                  <u style={{ color: 'link' }}>here</u>
                </Link>
                .
              </Alert>
              <br />
            </>
          ) : problemsNum < 10 ? (
            <>
              <Alert severity={10 - problemsNum > 3 ? 'info' : 'warning'}>
                <AlertTitle>{getAlertWarningTitle()}</AlertTitle>
                {t('create.limitAlertContent1')}
                <br />
                {t('create.limitAlertContent2')}{' '}
                <Link href={Path.PaymentSubscription}>
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
        {isProblemsLoading ? (
          <Box sx={{ p: 10, textAlign: 'center' }}>
            <CircularProgress size={80} />
          </Box>
        ) : (
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
        )}
      </Paper>
    </Layout>
  )
}

export const getStaticProps: GetServerSideProps = async (context) => {
  const { locale } = context
  return {
    props: { messages: require(`@/locales/${locale}.json`) },
  }
}
