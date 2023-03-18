import React, { FC, useEffect, useState } from 'react'

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
import { format } from 'date-fns'
import { ja, enUS } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk'

import cardBrandImg from '@/assets/img/cardBrands.png'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { SettingSidebar } from '@/components/templates/settings/SettingSidebar'
import { UserPlanFree, UserPlanPro, userPlans } from '@/constants/UserPlans'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { useSetBreadcrumbs } from '@/hooks/useSetBreadcrumbs'
import { squareService } from '@/services/squareService'
import { RootState } from '@/store'
import { commonSlice } from '@/store/common'
import { userSlice } from '@/store/user'
import { colors, fontSizes } from '@/themes/globalStyles'
import { SquareCard } from '@/types/model/squareCard'

export const PaymentSetting: FC = () => {
  const lang = useSelector((state: RootState) => state.lang.lang)
  const { user } = useGetAuthUser()
  const { t } = useTranslation()
  useSetBreadcrumbs([{ label: t('Setting.payment.title'), href: undefined }])

  const [card, setCard] = useState<SquareCard>()
  const [isCardLoading, setIsCardLoading] = useState<boolean>(false)
  const [isConfirmShow, setIsConfirmShow] = useState<boolean>(false)
  const dispatch = useDispatch()

  const submit = async (token: TokenResult) => {
    if (token.token) {
      dispatch(commonSlice.actions.updateIsBackdropShow(true))
      await squareService
        .updateSquareCard(token.token)
        .then(({ updateSquareCard }) => {
          if (updateSquareCard) {
            setCard(updateSquareCard)
            dispatch(
              commonSlice.actions.updateSnackBar({
                isSnackbarShow: true,
                snackBarMsg: t('Setting.payment.updateSuccessMessage'),
                snackBarType: 'success',
              }),
            )
          }
        })
        .catch(() => {
          dispatch(
            commonSlice.actions.updateSnackBar({
              isSnackbarShow: true,
              snackBarMsg: t('Setting.payment.updateFailedMessage'),
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
      .then(({ getSquareCard }) => {
        if (getSquareCard) {
          setCard(getSquareCard)
        }
      })
      .finally(() => {
        setIsCardLoading(false)
      })
  }, [user])

  const handleCloseConfirm = () => {
    setIsConfirmShow(false)
  }

  const handleConfirm = async () => {
    dispatch(commonSlice.actions.updateIsBackdropShow(true))
    setIsConfirmShow(false)
    await squareService
      .cancelSubscription()
      .then(({ cancelCurrentSubscription }) => {
        dispatch(
          commonSlice.actions.updateSnackBar({
            isSnackbarShow: true,
            snackBarMsg: t('Setting.payment.cancelSuccessMessage'),
            snackBarType: 'success',
          }),
        )
        if (!user) {
          return
        }
        dispatch(
          userSlice.actions.updateUser({
            ...user,
            subscriptionExpiresAt: cancelCurrentSubscription,
          }),
        )
      })
      .catch(() => {
        dispatch(
          commonSlice.actions.updateSnackBar({
            isSnackbarShow: true,
            snackBarMsg: t('Setting.payment.cancelFailedMessage'),
            snackBarType: 'error',
          }),
        )
      })
    dispatch(commonSlice.actions.updateIsBackdropShow(false))
  }

  return (
    <>
      <TitleBox title={t('Setting.payment.title')}>
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
                  {t('Setting.payment.currentPlan')}
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
                  {t('Setting.payment.currentCard')}
                </Typography>
                {card ? (
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ bgcolor: '#E3183714' }}>
                            {t('Setting.payment.cardNumber')}
                          </TableCell>
                          <TableCell>
                            {card && `xxxx-xxxx-xxxx-${card.last4}`}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ bgcolor: '#E3183714' }}>
                            {t('Setting.payment.cardExpiry')}
                          </TableCell>
                          <TableCell>
                            {card && `${card.expYear}/${card.expMonth}`}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ bgcolor: '#E3183714' }}>
                            {t('Setting.payment.cardBrand')}
                          </TableCell>
                          <TableCell>{card && card.cardBrand}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : isCardLoading ? (
                  <CircularProgress />
                ) : (
                  <>{t('Setting.payment.noCard')}</>
                )}
                {user?.plan === UserPlanPro && (
                  <>
                    <Divider sx={{ my: 4 }} />
                    <Typography
                      fontSize={fontSizes.l}
                      sx={{ pb: 1 }}
                      fontWeight="bold"
                    >
                      {t('Setting.payment.changeCardInfo')}
                    </Typography>
                    <Typography fontSize={fontSizes.m} sx={{ pb: 1 }}>
                      {t('Setting.payment.changeCardSupportedBrand')}
                    </Typography>
                    <img
                      src={cardBrandImg}
                      alt="VISA/Mastercard/American Express/JCB/Discover"
                      width="400px"
                    />
                    <PaymentForm
                      applicationId={import.meta.env.VITE_SQUARE_APPLICATION_ID}
                      cardTokenizeResponseReceived={(token) => {
                        submit(token)
                      }}
                      locationId={import.meta.env.VITE_SQUARE_LOCATION_ID}
                    >
                      <CreditCard
                        buttonProps={{
                          css: { backgroundColor: colors.secondary.main },
                        }}
                      >
                        {t('Setting.payment.changeCardButton')}
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
                  {t('Setting.payment.cancelSubscription')}
                </Typography>
                {!user.subscriptionExpiresAt ? (
                  <>
                    <Typography
                      fontSize={fontSizes.m}
                      sx={{ pb: 1 }}
                      color="primary"
                    >
                      ※ {t('Setting.payment.cancelSubscriptionWarning1')}
                      <br />※ {t('Setting.payment.cancelSubscriptionWarning2')}
                    </Typography>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => setIsConfirmShow(true)}
                    >
                      {t('Setting.payment.cancelSubscriptionButton')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography fontSize={fontSizes.m} sx={{ pb: 1 }}>
                      {t('Setting.payment.cancelSubscriptionMessage', {
                        date: format(
                          new Date(user?.subscriptionExpiresAt),
                          'yyyy/M/d',
                          {
                            locale: lang === 'ja' ? ja : enUS,
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
        <DialogTitle>
          {t('Setting.payment.cancelSubscriptionDialogTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ mb: 2, pb: 1 }}
            fontSize={fontSizes.m}
            color="primary"
          >
            ※ {t('Setting.payment.cancelSubscriptionWarning1')}
            <br />※ {t('Setting.payment.cancelSubscriptionWarning2')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => handleConfirm()}>
            {t('Setting.payment.cancelYesButton')}
          </Button>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleCloseConfirm}
          >
            {t('Setting.payment.cancelNoButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
