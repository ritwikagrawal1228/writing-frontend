import { GetServerSideProps } from 'next'
import React from 'react'

import { useQuery, gql } from '@apollo/client'
import { withSSRContext } from 'aws-amplify'

import Layout from '@/components/templates/Layout'

type Props = {
  userStr: string
  authenticated: boolean
}

export default function Problem({ authenticated, userStr }: Props) {
  const user = JSON.parse(userStr || '{}')
  const { data } = useQuery(gql`
    query {
      problemsByUserId(userId: "U1") {
        id
      }
    }
  `)

  return (
    <Layout title="Problems" description="a">
      <>
        Signed in as {user.name}
        <br />
      </>
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
