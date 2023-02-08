import { GetServerSideProps } from 'next'
import Image from 'next/image'
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
} from '@mui/material'
import { TokenResult } from '@square/web-payments-sdk-types'
import { withSSRContext } from 'aws-amplify'
import { useTranslations } from 'next-intl'

import Layout from '@/components/templates/Layout'

import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk'

import { TitleBox } from '@/components/templates/common/TitleBox'
import { SettingSidebar } from '@/components/templates/settings/SettingSidebar'
import { Path } from '@/constants/Path'
import { userPlans } from '@/constants/UserPlans'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { squareService } from '@/services/squareService'
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
  const [isConfirmShow, setIsConfirmShow] = useState<boolean>(false)
  const submit = (token: TokenResult) => {
    if (token.token) {
      squareService.updateSquareCard(token.token).then(({ data }) => {
        if (data.updateSquareCard) {
          setCard(data.updateSquareCard)
          alert('Card updated successfully')
        }
      })
    }
  }
  useEffect(() => {
    if (!user || card) {
      return
    }
    squareService.getSquareCard().then(({ data }) => {
      if (data.getSquareCard) {
        setCard(data.getSquareCard)
      }
    })
  }, [user])

  const handleCloseConfirm = () => {
    setIsConfirmShow(false)
  }

  const handleConfirm = () => {
    squareService
      .cancelSubscription()
      .then(({ data }) => {
        alert(data.cancelCurrentSubscription)
      })
      .finally(() => {
        setIsConfirmShow(false)
      })
  }

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
        <></>
      </TitleBox>
      <Grid container columnSpacing={2}>
        <Grid item xs={3}>
          <SettingSidebar />
        </Grid>
        <Grid item xs={9}>
          <Paper sx={{ minHeight: 200, padding: 4 }}>
            <Typography fontSize={fontSizes.l} sx={{ pb: 1 }} fontWeight="bold">
              Your Current Plan
            </Typography>
            <Typography fontSize={fontSizes.m} sx={{ pb: 1 }} fontWeight="bold">
              {user?.plan === userPlans[0] ? 'Free' : 'Pro'}
              {user?.subscriptionExpiresAt &&
                `Valid until${new Date(
                  user?.subscriptionExpiresAt,
                ).toLocaleString(router.locale)}`}
            </Typography>

            <Typography fontSize={fontSizes.l} sx={{ pb: 1 }} fontWeight="bold">
              Your Current Card
            </Typography>
            {card && (
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
            )}
            <Typography
              fontSize={fontSizes.l}
              sx={{ pb: 1, mt: 5 }}
              fontWeight="bold"
            >
              Change Payment Information
            </Typography>
            <Typography fontSize={fontSizes.m} sx={{ pb: 1 }}>
              Card brand supported
            </Typography>
            <Image
              src="/img/cardBrands.png"
              alt="VISA/Mastercard/American Express/JCB/Diners Club/Discover"
              width={300}
              height={150}
            />
            <PaymentForm
              applicationId={squareInfo.appId}
              cardTokenizeResponseReceived={(token, verifiedBuyer) => {
                submit(token)
              }}
              locationId={squareInfo.locationId}
            >
              <CreditCard
                buttonProps={{ css: { backgroundColor: colors.primary.main } }}
              >
                Change Card
              </CreditCard>
            </PaymentForm>
          </Paper>
          <Paper sx={{ minHeight: 200, padding: 4, mt: 4 }}>
            <Typography fontSize={fontSizes.l} sx={{ pb: 1 }} fontWeight="bold">
              Cancel Subscription
            </Typography>
            <Typography fontSize={fontSizes.m} sx={{ pb: 1 }} color="primary">
              ※ If you cancel your subscription, you will not be able to see
              your all tenth older problems.
              <br />※ It will be changed to the free plan on the next payment
              date
            </Typography>
            <Button
              color="primary"
              variant="contained"
              onClick={() => setIsConfirmShow(true)}
            >
              Cancel Subscription
            </Button>
          </Paper>
        </Grid>
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
