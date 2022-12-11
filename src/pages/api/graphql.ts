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
    req.body.variables = { userId: user.attributes.sub }
  }

  const client = getGraphQLClient(user)

  const result = await client
    .request<Data>(req.body.query, req.body.variables)
    .then((res) => {
      return { data: res, status: 200 }
    })
    .catch((err) => {
      console.log(err)
      return { data: err.response, status: 500 }
    })

  return res.status(result.status).json(result.data)
}
