import { GetServerSideProps } from 'next'
import React from 'react'

import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Paper, useTheme } from '@mui/material'
import { withSSRContext } from 'aws-amplify'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'

import Layout from '@/components/templates/Layout'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { CreateProblemForm } from '@/types/form/CreateProblemForm'

type Props = {
  userStr: string
  authenticated: boolean
}

export default function ProblemCreate({ authenticated, userStr }: Props) {
  const user = JSON.parse(userStr || '{}')
  const theme = useTheme()

  const methods = useForm<CreateProblemForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const onSubmit: SubmitHandler<CreateProblemForm> = (data) => {
    //
  }

  return (
    <Layout title="Problems" description="a">
      <TitleBox title="Problem Create">
        <Box sx={{ maxHeight: '36px' }}>
          <Button color="primary" variant="contained" startIcon={<AddIcon />}>
            <b>保存</b>
          </Button>
        </Box>
      </TitleBox>
      <Paper sx={{ minHeight: '500px', textAlign: 'center' }}>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            style={{ width: '100%' }}
          ></form>
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
