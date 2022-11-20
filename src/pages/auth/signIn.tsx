import { GetServerSideProps, NextPage } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { OAuthProviderType } from 'next-auth/providers'
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
  useSession,
} from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

type Props = {
  providers: Record<LiteralUnion<OAuthProviderType, string>, ClientSafeProvider>
}

const SignIn: NextPage<Props> = ({ providers }) => {
  const { data: session, status } = useSession()
  const signInWithProvider = (provider: ClientSafeProvider) => {
    signIn(provider.id).then((res) => {
      alert('ログインしました')
    })
  }

  useEffect(() => {
    console.log(session)
  }, [session])

  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signInWithProvider(provider)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
      <br />
      <button>
        <Link href={'/'}>Home</Link>
      </button>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}

export default SignIn
