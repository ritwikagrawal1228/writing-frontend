import { GetServerSideProps } from 'next'
import Script from 'next/script'
import React from 'react'

import { TokenResult } from '@square/web-payments-sdk-types'
import { withSSRContext } from 'aws-amplify'
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk'

import Layout from '@/components/templates/Layout'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { squareService } from '@/services/squareService'

type Props = {
  userStr: string
}

export default function PaymentSubscribe({ userStr }: Props) {
  const { user } = useGetAuthUser(userStr)

  const submit = (token: TokenResult) => {
    if (token.token) {
      squareService.subscribePaidPlan(token.token)
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
          applicationId={process.env.SQUARE_APPLICATION_ID}
          cardTokenizeResponseReceived={(token, verifiedBuyer) => {
            submit(token)
          }}
          locationId={process.env.SQUARE_LOCATION_ID}
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
