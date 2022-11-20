// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from './auth/[...nextauth]'
import { unstable_getServerSession } from 'next-auth/next'
import { gql, useQuery } from '@apollo/client'
import axios from 'axios'

type Data = {
  name: string
}

const uri = process.env.API_URL

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const session = await unstable_getServerSession(req, res, authOptions)

  axios
    .post(uri, req.body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
    })
    .then(({ data }) => {
      // console.log('res', data.data)
    })

  res.end()
}
