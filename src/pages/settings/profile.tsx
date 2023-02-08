import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import SaveIcon from '@mui/icons-material/Save'
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Snackbar,
  useTheme,
} from '@mui/material'
import { Storage, withSSRContext } from 'aws-amplify'
import imageCompression from 'browser-image-compression'
import { useTranslations } from 'next-intl'

import Layout from '@/components/templates/Layout'

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'

import { TitleBox } from '@/components/templates/common/TitleBox'
import { SettingSidebar } from '@/components/templates/settings/SettingSidebar'
import { ProfileSettingForm } from '@/components/templates/settings/profile/ProfileSettingForm'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { useProfileSettingDefaultFrom } from '@/hooks/useProfileSettingDefaultFrom'
import { userService } from '@/services/userService'
import { UpdateProfileSettingForm } from '@/types/form/ProfileSettingForm'

type Props = {
  userStr: string
}

export default function ProfileSetting({ userStr }: Props) {
  const { user, setUser } = useGetAuthUser(userStr)
  const theme = useTheme()
  const t = useTranslations('Problem')
  const router = useRouter()
  const [photo, setPhoto] = useState<File | string | undefined>('')
  const { profileSettingForm } = useProfileSettingDefaultFrom(user)
  const [isAlertShow, setIsAlertShow] = useState(false)

  const methods = useForm<UpdateProfileSettingForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  useEffect(() => {
    if (user && typeof photo === 'string') {
      setPhoto(user?.profileImageUrl)
    }
  }, [user])

  useEffect(() => {
    methods.reset(profileSettingForm)
  }, [profileSettingForm])

  const onSubmit: SubmitHandler<UpdateProfileSettingForm> = async (form) => {
    if (photo && typeof photo !== 'string') {
      const compPhoto = await imageCompression(photo, {
        maxSizeMB: 1,
      })
      const fileExt = compPhoto.name.split('.').pop()
      const res = await Storage.put(
        `${user?.id}-${Date.now()}.${fileExt}`,
        compPhoto,
      )
      form.profileImageUrl = await Storage.get(res.key)
    }

    const { updateUser } = await userService
      .updateProfile(form)
      .then(({ data }) => {
        setIsAlertShow(true)
        return data
      })

    setUser(updateUser)
  }

  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setIsAlertShow(false)
  }

  return (
    <Layout
      title={t('create.title')}
      description={t('create.title')}
      breadcrumbs={[{ label: 'Profile Settings', href: undefined }]}
      user={user}
    >
      <Snackbar
        open={isAlertShow}
        autoHideDuration={600}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity="success"
          onClose={handleAlertClose}
          sx={{ width: '100%' }}
        >
          Your profile successfully updated!
        </Alert>
      </Snackbar>
      <TitleBox title="Profile Setting">
        <Box sx={{ maxHeight: '36px' }}>
          <Button
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => methods.handleSubmit(onSubmit)()}
          >
            <b>{t('create.submitBtn')}</b>
          </Button>
        </Box>
      </TitleBox>
      <Grid container columnSpacing={2}>
        <Grid item xs={3}>
          <SettingSidebar />
        </Grid>
        <Grid item xs={9}>
          <Paper sx={{ minHeight: 200, p: 2 }}>
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                style={{ width: '100%' }}
              >
                <ProfileSettingForm
                  photo={photo}
                  setPhoto={setPhoto}
                  locale={router.locale}
                />
              </form>
            </FormProvider>
          </Paper>
        </Grid>
      </Grid>
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