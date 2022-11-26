// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { withSSRContext } from 'aws-amplify'
import { GraphQLClient } from 'graphql-request'

const uri = process.env.API_URL

type Data = object

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { Auth } = withSSRContext({ req })
  const user = await Auth.currentAuthenticatedUser()
  const accessToken = user.signInUserSession.accessToken.jwtToken
  const IdToken = user.signInUserSession.idToken.jwtToken

  const client = new GraphQLClient(uri, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'ID-Token': IdToken,
    },
  })

  const result = await client
    .request<Data>(req.body.query, req.body.variables)
    .then((res) => res)

  return res.status(200).json(result)
}
