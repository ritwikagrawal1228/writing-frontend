import React, { useEffect } from 'react'

import { useAuthenticator } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'

import '@aws-amplify/ui-react/styles.css'

import awsExports from '@/aws-exports'
import { Path } from '@/constants/Path'
import { useNavigate } from 'react-router-dom'

Amplify.configure({ ...awsExports, ssr: true })

export default function SignOut() {
  const { user, signOut } = useAuthenticator()
  const navigate = useNavigate()

  // Redirect After Sign In Success
  useEffect(() => {
    if (user) {
      signOut()
    }

    navigate(Path.Problem)
  }, [user])

  return <>Sign Out..</>
}
