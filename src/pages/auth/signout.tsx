import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthenticator } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'

import '@aws-amplify/ui-react/styles.css'

import awsExports from '@/aws-exports'
import { Path } from '@/constants/Path'

Amplify.configure({ ...awsExports })

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
