import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import {
  Grid,
  Paper,
  useTheme,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableBody,
  CircularProgress,
  Divider,
  Chip,
} from '@mui/material'
import { TokenResult } from '@square/web-payments-sdk-types'
import { withSSRContext } from 'aws-amplify'

import Layout from '@/components/templates/Layout'

import { format } from 'date-fns'

import { TitleBox } from '@/components/templates/common/TitleBox'

import { ja, enUS } from 'date-fns/locale'

import { SettingSidebar } from '@/components/templates/settings/SettingSidebar'

import { useTranslations } from 'next-intl'

import { Path } from '@/constants/Path'

import { useDispatch } from 'react-redux'

import { UserPlanFree, UserPlanPro, userPlans } from '@/constants/UserPlans'

import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk'

import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { squareService } from '@/services/squareService'
import { commonSlice } from '@/store/common'
import { colors, fontSizes } from '@/themes/globalStyles'
import { SquareCard } from '@/types/model/squareCard'

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
  const [card, setCard] = useState<SquareCard>()
  const [isCardLoading, setIsCardLoading] = useState<boolean>(true)
  const [isConfirmShow, setIsConfirmShow] = useState<boolean>(false)
  const dispatch = useDispatch()

  const submit = async (token: TokenResult) => {
    if (token.token) {
      dispatch(commonSlice.actions.updateIsBackdropShow(true))
      await squareService
        .updateSquareCard(token.token)
        .then(({ data }) => {
          if (data.updateSquareCard) {
            setCard(data.updateSquareCard)
            dispatch(
              commonSlice.actions.updateSnackBar({
                isSnackbarShow: true,
                snackBarMsg: 'Your card is updated successfully',
                snackBarType: 'success',
              }),
            )
          }
        })
        .catch(() => {
          dispatch(
            commonSlice.actions.updateSnackBar({
              isSnackbarShow: true,
              snackBarMsg: 'Failed to update your card',
              snackBarType: 'error',
            }),
          )
        })
      dispatch(commonSlice.actions.updateIsBackdropShow(false))
    }
  }
  useEffect(() => {
    if (!user || card) {
      return
    }
    if (user.plan === UserPlanFree) {
      return
    }
    setIsCardLoading(true)
    squareService
      .getSquareCard()
      .then(({ data }) => {
        if (data.getSquareCard) {
          setCard(data.getSquareCard)
        }
      })
      .finally(() => {
        setIsCardLoading(false)
      })
  }, [user])

  const handleCloseConfirm = () => {
    setIsConfirmShow(false)
  }

  const handleConfirm = () => {
    dispatch(commonSlice.actions.updateIsBackdropShow(true))
    squareService
      .cancelSubscription()
      .then(({ data }) => {
        dispatch(
          commonSlice.actions.updateSnackBar({
            isSnackbarShow: true,
            snackBarMsg: 'Your subscription is canceled successfully',
            snackBarType: 'success',
          }),
        )
      })
      .catch(() => {
        dispatch(
          commonSlice.actions.updateSnackBar({
            isSnackbarShow: true,
            snackBarMsg: 'Failed to cancel your subscription',
            snackBarType: 'error',
          }),
        )
      })
      .finally(() => {
        setIsConfirmShow(false)
      })
    dispatch(commonSlice.actions.updateIsBackdropShow(false))
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
      <TitleBox title="Payment Setting">
        <></>
      </TitleBox>
      <Grid container columnSpacing={2}>
        <>
          <Grid item xs={3}>
            <SettingSidebar />
          </Grid>
          <Grid item xs={9}>
            <Paper sx={{ minHeight: 200, padding: 4 }}>
              <>
                <Typography
                  fontSize={fontSizes.l}
                  sx={{ pb: 1 }}
                  fontWeight="bold"
                >
                  Your Current Plan
                </Typography>
                <Typography fontSize={fontSizes.m} fontWeight="bold">
                  <Chip
                    label={user?.plan === userPlans[0] ? 'Free' : '👑 Pro'}
                    sx={{ mr: 2 }}
                  />
                  {user?.subscriptionExpiresAt && (
                    <>
                      Valid until{' '}
                      {format(
                        new Date(user?.subscriptionExpiresAt),
                        'yyyy/M/d',
                        {
                          locale: router.locale === 'ja' ? ja : enUS,
                        },
                      )}
                    </>
                  )}
                </Typography>
                <Divider sx={{ my: 3 }} />
                <Typography
                  fontSize={fontSizes.l}
                  sx={{ pb: 1 }}
                  fontWeight="bold"
                >
                  Your Current Card
                </Typography>
                {card ? (
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ bgcolor: '#E3183714' }}>
                            Card number
                          </TableCell>
                          <TableCell>
                            {card && `xxxx-xxxx-xxxx-${card.last4}`}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ bgcolor: '#E3183714' }}>
                            Card expires
                          </TableCell>
                          <TableCell>
                            {card && `${card.expYear}/${card.expMonth}`}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ bgcolor: '#E3183714' }}>
                            Card brand
                          </TableCell>
                          <TableCell>{card && card.cardBrand}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : isCardLoading ? (
                  <CircularProgress />
                ) : (
                  <>You do not have any card</>
                )}
                {user?.plan === UserPlanPro && (
                  <>
                    <Divider sx={{ my: 4 }} />
                    <Typography
                      fontSize={fontSizes.l}
                      sx={{ pb: 1 }}
                      fontWeight="bold"
                    >
                      Change Payment Information
                    </Typography>
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
                      cardTokenizeResponseReceived={(token) => {
                        submit(token)
                      }}
                      locationId={squareInfo.locationId}
                    >
                      <CreditCard
                        buttonProps={{
                          css: { backgroundColor: colors.primary.main },
                        }}
                      >
                        Change Card
                      </CreditCard>
                    </PaymentForm>
                  </>
                )}
              </>
            </Paper>
            {card && user?.plan === UserPlanPro && (
              <Paper sx={{ padding: 4, mt: 4 }}>
                <Typography
                  fontSize={fontSizes.l}
                  sx={{ pb: 1 }}
                  fontWeight="bold"
                >
                  Cancel Subscription
                </Typography>
                {!user.subscriptionExpiresAt ? (
                  <>
                    <Typography
                      fontSize={fontSizes.m}
                      sx={{ pb: 1 }}
                      color="primary"
                    >
                      ※ If you cancel your subscription, you will not be able to
                      see your all tenth older problems.
                      <br />※ It will be changed to the free plan on the next
                      payment date
                    </Typography>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => setIsConfirmShow(true)}
                    >
                      Cancel Subscription
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography fontSize={fontSizes.m} sx={{ pb: 1 }}>
                      Your subscription will be expired on{' '}
                      {format(
                        new Date(user?.subscriptionExpiresAt),
                        'yyyy/M/d',
                        {
                          locale: router.locale === 'ja' ? ja : enUS,
                        },
                      )}
                    </Typography>
                  </>
                )}
              </Paper>
            )}
          </Grid>
        </>
      </Grid>
      <Dialog open={isConfirmShow} onClose={handleCloseConfirm}>
        <DialogTitle>Are you sure you want to cancel subscription</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ mb: 2, pb: 1 }}
            fontSize={fontSizes.m}
            color="primary"
          >
            ※ If you cancel your subscription,
            <br /> you will not be able to see your all tenth older problems.
            <br />※ It will be changed to the free plan on the next payment date
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => handleConfirm()}
          >
            Yes
          </Button>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleCloseConfirm}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
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
