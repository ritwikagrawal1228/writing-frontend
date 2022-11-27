// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { withSSRContext } from 'aws-amplify'

import { getGraphQLClient } from '@/utils/graphqlClient'

const uri = process.env.API_URL

type Data = object

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { Auth } = withSSRContext({ req })
  const user = await Auth.currentAuthenticatedUser()

  if (!req.body.variables) {
    req.body.variables = { userId: user.sub }
  }

  const client = getGraphQLClient(user)

  const result = await client
    .request<Data>(req.body.query, req.body.variables)
    .then((res) => res)

  console.log(result)

  return res.status(200).json(result)
}
