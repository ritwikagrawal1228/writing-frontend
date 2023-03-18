import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'

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
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import cardBrandImg from '@/assets/img/cardBrands.png'
import { SquareCardForm } from '@/components/parts/common/SquareCardForm'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { Path } from '@/constants/Path'
import { subtotal, taxRate } from '@/constants/Price'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { useSetBreadcrumbs } from '@/hooks/useSetBreadcrumbs'
import { squareService } from '@/services/squareService'
import { commonSlice } from '@/store/common'
import { fontSizes } from '@/themes/globalStyles'

export const PaymentSubscribe: FC = () => {
  const { amplifyUser } = useGetAuthUser()
  const { t } = useTranslation()
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useSetBreadcrumbs([{ label: t('Payment.title'), href: undefined }])

  const submit = async (token: any) => {
    if (!token.token) {
      return
    }

    dispatch(commonSlice.actions.updateIsBackdropShow(true))
    const { subscribePaidPlan } = await squareService.subscribePaidPlan(
      token.token,
      amplifyUser,
    )
    dispatch(commonSlice.actions.updateIsBackdropShow(false))
    if (subscribePaidPlan) {
      dispatch(
        commonSlice.actions.updateSnackBar({
          isSnackbarShow: true,
          snackBarMsg: t('Payment.paymentSuccess'),
          snackBarType: 'success',
        }),
      )
      setTimeout(() => {
        navigate(Path.ProblemCreate)
      }, 3000)
    } else {
      dispatch(
        commonSlice.actions.updateSnackBar({
          isSnackbarShow: true,
          snackBarMsg: t('Payment.paymentFailed'),
          snackBarType: 'error',
        }),
      )
    }
  }

  return (
    <>
      <>
        <TitleBox title={t('Payment.title')}>
          <></>
        </TitleBox>
        <Paper sx={{ minHeight: '460px', p: 4 }}>
          <Grid container columnSpacing={3}>
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                {t('Payment.paymentDetail')}
              </Typography>
              <TableContainer sx={{ mb: 3 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableBody>
                    <TableRow sx={{ 'td, th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {t('Payment.subtotal')}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        ¥{subtotal}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {t('Payment.consumptionTax')}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        ¥{(subtotal * taxRate) / 100}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {t('Payment.total')}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        ¥{subtotal + (subtotal * taxRate) / 100}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography fontSize={fontSizes.m} sx={{ pb: 1 }}>
                {t('Payment.cardBrandsSupported')}
              </Typography>
              <img
                src={cardBrandImg}
                alt="VISA/Mastercard/American Express/JCB/Discover"
                width="400px"
              />
              <SquareCardForm
                buttonText={t('Payment.proceedToPayment')}
                submit={submit}
              />
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
                  👑 {t('Payment.proPlanTitle')}
                </Typography>
                <Typography variant="h4" sx={{ mb: 3 }}>
                  {`¥${subtotal}`}
                </Typography>
                <Typography fontSize={fontSizes.l} sx={{ pb: 1 }}>
                  ✨ {t('Payment.proFeature1')}
                  <br />
                  <br />✨ {t('Payment.proFeature2')}
                  <br />
                  <br />✨ {t('Payment.proFeature3')}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </>
    </>
  )
}
