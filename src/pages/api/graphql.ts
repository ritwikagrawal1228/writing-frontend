// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { withSSRContext } from 'aws-amplify'
import axios from 'axios'

type Data = {
  name: string
}

const uri = process.env.API_URL

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { Auth } = withSSRContext({ req })
  const user = await Auth.currentAuthenticatedUser()
  const accessToken = user.signInUserSession.accessToken.jwtToken
  const IdToken = user.signInUserSession.idToken.jwtToken

  const posts = await axios
    .post(uri, req.body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'ID-Token': IdToken,
      },
    })
    .then(({ data }) => {
      return data
    })

  res.status(200).json(posts)
}
