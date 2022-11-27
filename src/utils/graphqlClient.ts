import { GraphQLClient } from 'graphql-request'

const uri = process.env.API_URL

export const getGraphQLClient = (user: any) => {
  const accessToken = user.signInUserSession.accessToken.jwtToken
  const IdToken = user.signInUserSession.idToken.jwtToken

  return new GraphQLClient(uri, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'ID-Token': IdToken,
    },
  })
}
