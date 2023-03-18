import { GraphQLClient } from 'graphql-request'

import { AmplifyUser } from '@/types/model/amplifyUser'

export const getGraphQLClient = (user?: AmplifyUser) => {
  const accessToken = user?.signInUserSession.accessToken.jwtToken
  const IdToken = user?.signInUserSession.idToken.jwtToken
  const uri = `${import.meta.env.VITE_API_SERVER_URI}/query`

  return new GraphQLClient(uri, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'ID-Token': IdToken || '',
    },
    credentials: 'include',
    mode: 'cors',
  })
}
