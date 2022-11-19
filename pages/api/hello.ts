// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from "next-auth/jwt"
import { authOptions } from './auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

type Data = {
  name: string
}

const secret = process.env.NEXTAUTH_SECRET

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await unstable_getServerSession(req, res, authOptions)
  console.log("Session", JSON.stringify(session, null, 2))
  const token = await getToken({ req, secret })
  console.log("JSON Web Token", token)

  res.end()
}
