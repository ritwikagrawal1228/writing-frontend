import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import { useAuthenticator } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'

import '@aws-amplify/ui-react/styles.css'

import awsExports from '@/aws-exports'
import { Path } from '@/constants/Path'

Amplify.configure({ ...awsExports, ssr: true })

export default function SignOut() {
  const { user, signOut } = useAuthenticator()
  const route = useRouter()

  // Redirect After Sign In Success
  useEffect(() => {
    if (user) {
      signOut()
    }

    route.push(Path.LP)
  }, [user])

  return <>Sign Out..</>
}
