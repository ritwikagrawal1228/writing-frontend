import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import {
  Grid,
  Paper,
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
import { format } from 'date-fns'
import { ja, enUS } from 'date-fns/locale'
import { useTranslations } from 'next-intl'
import { useDispatch } from 'react-redux'
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk'

import Layout from '@/components/templates/Layout'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { SettingSidebar } from '@/components/templates/settings/SettingSidebar'
import { UserPlanFree, UserPlanPro, userPlans } from '@/constants/UserPlans'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { squareService } from '@/services/squareService'
import { commonSlice } from '@/store/common'
import { userSlice } from '@/store/user'
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
  const t = useTranslations('Setting')
  const router = useRouter()
  const [card, setCard] = useState<SquareCard>()
  const [isCardLoading, setIsCardLoading] = useState<boolean>(false)
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
                snackBarMsg: t('payment.updateSuccessMessage'),
                snackBarType: 'success',
              }),
            )
          }
        })
        .catch(() => {
          dispatch(
            commonSlice.actions.updateSnackBar({
              isSnackbarShow: true,
              snackBarMsg: t('payment.updateFailedMessage'),
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

  const report = (eventName: string) => {
    const TRACKING_ID = process.env.NEXT_PUBLIC_GA4_TRACKING_ID as string
    if (TRACKING_ID || !router.isPreview) {
      gtag('event', eventName, {
        page_path: window.location.pathname,
        send_to: TRACKING_ID,
      })
    }
  }

  const handleConfirm = async () => {
    dispatch(commonSlice.actions.updateIsBackdropShow(true))
    setIsConfirmShow(false)
    await squareService
      .cancelSubscription()
      .then(({ data }) => {
        dispatch(
          commonSlice.actions.updateSnackBar({
            isSnackbarShow: true,
            snackBarMsg: t('payment.cancelSuccessMessage'),
            snackBarType: 'success',
          }),
        )
        if (!user) {
          return
        }
        dispatch(
          userSlice.actions.updateUser({
            ...user,
            subscriptionExpiresAt: data.cancelCurrentSubscription,
          }),
        )
        report('refund')
      })
      .catch((err) => {
        dispatch(
          commonSlice.actions.updateSnackBar({
            isSnackbarShow: true,
            snackBarMsg: t('payment.cancelFailedMessage'),
            snackBarType: 'error',
          }),
        )
      })
    dispatch(commonSlice.actions.updateIsBackdropShow(false))
  }

  return (
    <Layout
      title={t('payment.title')}
      description={t('payment.title')}
      breadcrumbs={[{ label: t('payment.title'), href: undefined }]}
    >
      <TitleBox title={t('payment.title')}>
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
                  {t('payment.currentPlan')}
                </Typography>
                <Typography fontSize={fontSizes.m} fontWeight="bold">
                  <Chip
                    label={user?.plan === userPlans[0] ? 'Free' : '👑 Pro'}
                    sx={{ mr: 2 }}
                  />
                </Typography>
                <Divider sx={{ my: 3 }} />
                <Typography
                  fontSize={fontSizes.l}
                  sx={{ pb: 1 }}
                  fontWeight="bold"
                >
                  {t('payment.currentCard')}
                </Typography>
                {card ? (
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ bgcolor: '#E3183714' }}>
                            {t('payment.cardNumber')}
                          </TableCell>
                          <TableCell>
                            {card && `xxxx-xxxx-xxxx-${card.last4}`}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ bgcolor: '#E3183714' }}>
                            {t('payment.cardExpiry')}
                          </TableCell>
                          <TableCell>
                            {card && `${card.expYear}/${card.expMonth}`}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ bgcolor: '#E3183714' }}>
                            {t('payment.cardBrand')}
                          </TableCell>
                          <TableCell>{card && card.cardBrand}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : isCardLoading ? (
                  <CircularProgress />
                ) : (
                  <>{t('payment.noCard')}</>
                )}
                {user?.plan === UserPlanPro && (
                  <>
                    <Divider sx={{ my: 4 }} />
                    <Typography
                      fontSize={fontSizes.l}
                      sx={{ pb: 1 }}
                      fontWeight="bold"
                    >
                      {t('payment.changeCardInfo')}
                    </Typography>
                    <Typography fontSize={fontSizes.m} sx={{ pb: 1 }}>
                      {t('payment.changeCardSupportedBrand')}
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
                          css: { backgroundColor: colors.secondary.main },
                        }}
                      >
                        {t('payment.changeCardButton')}
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
                  {t('payment.cancelSubscription')}
                </Typography>
                {!user.subscriptionExpiresAt ? (
                  <>
                    <Typography
                      fontSize={fontSizes.m}
                      sx={{ pb: 1 }}
                      color="primary"
                    >
                      ※ {t('payment.cancelSubscriptionWarning1')}
                      <br />※ {t('payment.cancelSubscriptionWarning2')}
                    </Typography>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => setIsConfirmShow(true)}
                    >
                      {t('payment.cancelSubscriptionButton')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography fontSize={fontSizes.m} sx={{ pb: 1 }}>
                      {t('payment.cancelSubscriptionMessage', {
                        date: format(
                          new Date(user?.subscriptionExpiresAt),
                          'yyyy/M/d',
                          {
                            locale: router.locale === 'ja' ? ja : enUS,
                          },
                        ),
                      })}
                    </Typography>
                  </>
                )}
              </Paper>
            )}
          </Grid>
        </>
      </Grid>
      <Dialog open={isConfirmShow} onClose={handleCloseConfirm}>
        <DialogTitle>{t('payment.cancelSubscriptionDialogTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ mb: 2, pb: 1 }}
            fontSize={fontSizes.m}
            color="primary"
          >
            ※ {t('payment.cancelSubscriptionWarning1')}
            <br />※ {t('payment.cancelSubscriptionWarning2')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => handleConfirm()}>
            {t('payment.cancelYesButton')}
          </Button>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleCloseConfirm}
          >
            {t('payment.cancelNoButton')}
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
        destination: '/',
      },
    }
  }
}
