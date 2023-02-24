import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Script from 'next/script'
import React from 'react'

import {
  Grid,
  Paper,
  Typography,
  TableCell,
  TableContainer,
  TableRow,
  useTheme,
  TableBody,
} from '@mui/material'
import Table from '@mui/material/Table'

import Layout from '@/components/templates/Layout'

import { TokenResult } from '@square/web-payments-sdk-types'

import { TitleBox } from '@/components/templates/common/TitleBox'

import { withSSRContext } from 'aws-amplify'

import { Path } from '@/constants/Path'

import { useDispatch } from 'react-redux'

import { subtotal, taxRate } from '@/constants/Price'

import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk'

import { UserPlanFree } from '@/constants/UserPlans'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { squareService } from '@/services/squareService'
import { userService } from '@/services/userService'
import { commonSlice } from '@/store/common'
import { colors, fontSizes } from '@/themes/globalStyles'

type Props = {
  userStr: string
  squareInfo: {
    appId: string
    locationId: string
  }
}

export default function PaymentSubscribe({ userStr, squareInfo }: Props) {
  useGetAuthUser(userStr)
  const theme = useTheme()
  const router = useRouter()
  const dispatch = useDispatch()

  const submit = async (token: TokenResult) => {
    if (!token.token) {
      return
    }
    dispatch(commonSlice.actions.updateIsBackdropShow(true))
    const { data } = await squareService.subscribePaidPlan(token.token)
    dispatch(commonSlice.actions.updateIsBackdropShow(true))
    if (data.subscribePaidPlan) {
      dispatch(
        commonSlice.actions.updateSnackBar({
          isSnackbarShow: true,
          snackBarMsg: 'Your plan has been upgraded successfully.',
          snackBarType: 'success',
        }),
      )
      setTimeout(() => {
        router.push(Path.ProblemCreate)
      }, 3000)
    } else {
      dispatch(
        commonSlice.actions.updateSnackBar({
          isSnackbarShow: true,
          snackBarMsg: 'Failed to upgrade your plan. Please try again later.',
          snackBarType: 'error',
        }),
      )
    }
  }

  return (
    <>
      <Script src="https://sandbox.web.squarecdn.com/v1/square.js" />
      <Script></Script>
      <Layout
        title="Upgrade Plan"
        breadcrumbs={[{ label: 'Upgrade Plan', href: undefined }]}
      >
        <TitleBox title="Upgrade Plan">
          <></>
        </TitleBox>
        <Paper sx={{ minHeight: '460px', p: 4 }}>
          <Grid container columnSpacing={3}>
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Payment Details
              </Typography>
              <TableContainer sx={{ mb: 3 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableBody>
                    <TableRow sx={{ 'td, th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        Subtotal
                      </TableCell>
                      <TableCell component="th" scope="row">
                        ¥{subtotal}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Consumption Tax
                      </TableCell>
                      <TableCell component="th" scope="row">
                        ¥{(subtotal * taxRate) / 100}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        Total
                      </TableCell>
                      <TableCell component="th" scope="row">
                        ¥{subtotal + (subtotal * taxRate) / 100}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography fontSize={fontSizes.m} sx={{ pb: 1 }}>
                Card brand supported
              </Typography>
              <img
                src="/img/cardBrands.png"
                alt="VISA/Mastercard/American Express/JCB/Discover"
                width="400px"
              />
              <PaymentForm
                applicationId={squareInfo.appId}
                cardTokenizeResponseReceived={(token, verifiedBuyer) => {
                  submit(token)
                }}
                locationId={squareInfo.locationId}
              >
                <CreditCard
                  buttonProps={{
                    css: { backgroundColor: colors.secondary.main },
                  }}
                >
                  Proceed to Payment
                </CreditCard>
              </PaymentForm>
            </Grid>
            <Grid item xs={6}>
              <Paper
                sx={{
                  height: '100%',
                  p: 4,
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                }}
              >
                <Typography variant="h6" sx={{ mb: 3 }}>
                  👑 Professional Plan
                </Typography>
                <Typography variant="h4" sx={{ mb: 3 }}>
                  {`¥${subtotal}`}
                </Typography>
                <Typography fontSize={fontSizes.l} sx={{ pb: 1 }}>
                  ✨ You can store problems as much as you want
                  <br />
                  <br />✨ Ads will not be displayed at all
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context
  const { Auth } = withSSRContext({ req: context.req })

  try {
    const userData = await Auth.currentAuthenticatedUser()
    const squareInfo = {
      appId: process.env.SQUARE_APPLICATION_ID || '',
      locationId: process.env.SQUARE_LOCATION_ID || '',
    }
    const { user } = await userService.getAuthUserFromServer(userData)

    if (!user) {
      return {
        redirect: {
          permanent: false,
          destination: context.req.headers.referer || Path.Auth,
        },
      }
    }

    if (user.plan !== UserPlanFree) {
      return {
        redirect: {
          permanent: false,
          destination: Path.Auth,
        },
      }
    }

    return {
      props: {
        authenticated: true,
        userStr: JSON.stringify(userData.attributes),
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
