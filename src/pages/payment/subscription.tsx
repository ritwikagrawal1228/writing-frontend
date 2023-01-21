import { GetServerSideProps } from 'next'
import Script from 'next/script'
import React from 'react'

import { TokenResult } from '@square/web-payments-sdk-types'
import { withSSRContext } from 'aws-amplify'
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk'

import Layout from '@/components/templates/Layout'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { userService } from '@/services/userService'

type Props = {
  userStr: string
  squareInfo: {
    appId: string
    locationId: string
  }
}

export default function PaymentSubscribe({ userStr, squareInfo }: Props) {
  const { user } = useGetAuthUser(userStr)

  const submit = (token: TokenResult) => {
    if (token.token) {
      userService.subscribePaidPlan(token.token)
    }
  }

  return (
    <>
      <Script src="https://sandbox.web.squarecdn.com/v1/square.js" />
      <Script></Script>
      <Layout
        title="Payment Subscribe"
        breadcrumbs={[{ label: 'Payment Subscribe', href: undefined }]}
        user={user}
      >
        <PaymentForm
          applicationId={squareInfo.appId}
          cardTokenizeResponseReceived={(token, verifiedBuyer) => {
            submit(token)
          }}
          locationId={squareInfo.locationId}
        >
          <CreditCard />
        </PaymentForm>
      </Layout>
    </>
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
