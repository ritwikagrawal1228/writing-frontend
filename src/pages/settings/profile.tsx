import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import SaveIcon from '@mui/icons-material/Save'
import { Box, Button, Grid, Paper } from '@mui/material'
import { Storage } from 'aws-amplify'
import imageCompression from 'browser-image-compression'
import { useTranslations } from 'next-intl'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'

import Layout from '@/components/templates/Layout'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { SettingSidebar } from '@/components/templates/settings/SettingSidebar'
import { ProfileSettingForm } from '@/components/templates/settings/profile/ProfileSettingForm'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { useProfileSettingDefaultFrom } from '@/hooks/useProfileSettingDefaultFrom'
import { userService } from '@/services/userService'
import { commonSlice } from '@/store/common'
import { userSlice } from '@/store/user'
import { UpdateProfileSettingForm } from '@/types/form/ProfileSettingForm'

export default function ProfileSetting() {
  const { user } = useGetAuthUser()
  const t = useTranslations('Setting')
  const router = useRouter()
  const [photo, setPhoto] = useState<File | string | undefined>('')
  const { profileSettingForm } = useProfileSettingDefaultFrom(user)
  const dispatch = useDispatch()

  const methods = useForm<UpdateProfileSettingForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  useEffect(() => {
    if (user && user.profileImageKey && typeof photo === 'string') {
      Storage.get(user.profileImageKey)
        .then((res) => {
          setPhoto(res)
        })
        .catch((err) => {
          console.error(err)
        })
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
      form.profileImageKey = res.key
    }

    if (!photo) {
      form.profileImageKey = ''
    }

    dispatch(commonSlice.actions.updateIsBackdropShow(true))
    const { updateUserProfile } = await userService
      .updateProfile(form)
      .then(({ data }) => {
        dispatch(
          commonSlice.actions.updateSnackBar({
            isSnackbarShow: true,
            snackBarMsg: 'Your profile successfully updated!',
            snackBarType: 'success',
          }),
        )
        return data
      })
    dispatch(commonSlice.actions.updateIsBackdropShow(false))

    dispatch(userSlice.actions.updateUser(updateUserProfile))
  }

  return (
    <Layout
      title={t('profile.title')}
      description={t('profile.description')}
      breadcrumbs={[{ label: t('profile.title'), href: undefined }]}
    >
      <TitleBox title={t('profile.title')}>
        <Box sx={{ maxHeight: '36px' }}>
          <Button
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => methods.handleSubmit(onSubmit)()}
          >
            <b>{t('profile.saveButton')}</b>
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

export const getStaticProps: GetServerSideProps = async (context) => {
  const { locale } = context
  return {
    props: { messages: require(`@/locales/${locale}.json`) },
  }
}
