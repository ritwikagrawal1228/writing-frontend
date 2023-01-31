import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import SaveIcon from '@mui/icons-material/Save'
import {
  Box,
  Button,
  Grid,
  Paper,
  useTheme,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material'
import { TokenResult } from '@square/web-payments-sdk-types'
import { withSSRContext } from 'aws-amplify'
import { useTranslations } from 'next-intl'
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk'

import Layout from '@/components/templates/Layout'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { SettingSidebar } from '@/components/templates/settings/SettingSidebar'
import { Path } from '@/constants/Path'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { fontSizes } from '@/themes/globalStyles'

type Props = {
  userStr: string
  squareInfo: {
    appId: string
    locationId: string
  }
}

export default function PaymentSetting({ userStr, squareInfo }: Props) {
  const { user } = useGetAuthUser(userStr)
  const theme = useTheme()
  const t = useTranslations('Problem')
  const router = useRouter()
  const submit = (token: TokenResult) => {
    if (token.token) {
      return
    }
  }
  useEffect(() => {
    // TODO : GET user's card info
  }, [])

  return (
    <Layout
      title={t('create.title')}
      description={t('create.title')}
      breadcrumbs={[
        { label: t('list.title'), href: Path.Problem },
        { label: t('create.title'), href: undefined },
      ]}
      user={user}
    >
      <TitleBox title="Payment Setting">
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
          <Paper sx={{ minHeight: 200, padding: 4 }}>
            <Typography fontSize={fontSizes.l} sx={{ pb: 1 }}>
              Your Current Card
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableRow>
                  <TableCell sx={{ bgcolor: '#E3183714' }}>
                    Card number
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#E3183714' }}>
                    Card expires
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#E3183714' }}>
                    Card brand
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </Table>
            </TableContainer>
            <Typography fontSize={fontSizes.l} sx={{ pb: 1, mt: 3 }}>
              Change Payment Information
            </Typography>
            <PaymentForm
              applicationId={squareInfo.appId}
              cardTokenizeResponseReceived={(token, verifiedBuyer) => {
                submit(token)
              }}
              locationId={squareInfo.locationId}
            >
              <CreditCard>Change Card</CreditCard>
            </PaymentForm>
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
    const squareInfo = {
      appId: process.env.SQUARE_APPLICATION_ID || '',
      locationId: process.env.SQUARE_LOCATION_ID || '',
    }

    return {
      props: {
        authenticated: true,
        userStr: JSON.stringify(user.attributes),
        messages: require(`@/locales/${locale}.json`),
        squareInfo,
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
