import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import SaveIcon from '@mui/icons-material/Save'
import { Box, Button, Grid, Paper, useTheme } from '@mui/material'
import { withSSRContext } from 'aws-amplify'
import { useTranslations } from 'next-intl'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'

import Layout from '@/components/templates/Layout'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { SettingSidebar } from '@/components/templates/settings/SettingSidebar'
import { ProfileSettingForm } from '@/components/templates/settings/profile/ProfileSettingForm'
import { Path } from '@/constants/Path'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { useProfileSettingDefaultFrom } from '@/hooks/useProfileSettingDefaultFrom'
import { UpdateProfileSettingForm } from '@/types/form/ProfileSettingForm'

type Props = {
  userStr: string
}

export default function ProfileSetting({ userStr }: Props) {
  const { user } = useGetAuthUser(userStr)
  const theme = useTheme()
  const t = useTranslations('Problem')
  const router = useRouter()
  const [photo, setPhoto] = useState<File | undefined>(undefined)
  const { profileSettingForm } = useProfileSettingDefaultFrom(user)

  const methods = useForm<UpdateProfileSettingForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  useEffect(() => {
    methods.reset(profileSettingForm)
  }, [profileSettingForm])

  const onSubmit: SubmitHandler<UpdateProfileSettingForm> = async (data) => {
    // Send
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
      <TitleBox title="Profile Setting">
        <Box sx={{ maxHeight: '36px' }}>
          <Button color="primary" variant="contained" startIcon={<SaveIcon />}>
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
