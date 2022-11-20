import { graphql } from '@/graphql/client'
import { Query, QueryProblemsByUserIdArgs } from '@/graphql/client/graphql'
import { TypedDocumentNode, useQuery, gql } from '@apollo/client'
import { DocumentNode, QueryDocumentKeys } from 'graphql/language/ast'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Home() {
  const { data: session, status } = useSession()
  // const { data } = useQuery(gql`
  //   query {
  //     problemsByUserId(userId: "U1") {
  //       id
  //     }
  //   }
  // `)

  // useEffect(() => {
  //   console.log(data)
  // }, [data])

  if (status === 'loading') {
    return null
  }

  if (session && session.user) {
    return (
      <>
        Signed in as {session.user.email}
        <br />
        <button onClick={() => signOut()}>Sign Out</button>
        <br />
        <Link href="/setting">設定ページへ</Link>
      </>
    )
  }

  return (
    <>
      Json <br />
      {/* {JSON.stringify(data)} <br /> */}
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
