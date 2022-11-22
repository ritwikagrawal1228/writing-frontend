import Link from 'next/link'
import React from 'react'

import { useQuery, gql } from '@apollo/client'

import Layout from '@/components/templates/Layout'

type Props = {
  session: string
}

export default function Problem(props: Props) {
  const { data } = useQuery(gql`
    query {
      problemsByUserId(userId: "U1") {
        id
      }
    }
  `)

  const signOut = () => {
    return
  }

  return (
    <Layout title="a" description="a">
      <>
        {/* Signed in as {session?.user?.email} */}
        <br />
        <button onClick={() => signOut()}>Sign Out</button>
        <br />
        <Link href="/setting">設定ページへ</Link>
      </>
    </Layout>
  )
}
