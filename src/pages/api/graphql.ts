// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import axios from 'axios'

type Data = {
  name: string
}

const uri = process.env.API_URL

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const accessToken = ''

  axios
    .post(uri, req.body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(({ data }) => {
      // console.log('res', data.data)
    })

  res.end()
}
