import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()

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
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
