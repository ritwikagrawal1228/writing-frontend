import { GraphQLClient } from 'graphql-request'

export const getGraphQLClient = (user: any) => {
  const accessToken = user.signInUserSession.accessToken.jwtToken
  const IdToken = user.signInUserSession.idToken.jwtToken
  const uri = process.env.API_URL

  return new GraphQLClient(uri, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'ID-Token': IdToken,
    },
  })
}
