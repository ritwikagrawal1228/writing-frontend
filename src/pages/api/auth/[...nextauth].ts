import NextAuth, { NextAuthOptions } from 'next-auth'
import CognitoProvider from 'next-auth/providers/cognito'

export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      issuer: process.env.COGNITO_ISSUER
    })
  ],
  session: { strategy: 'jwt' },
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 24 * 30
  },
  callbacks: {
    async session({ session, token }) {
      session.user.accessToken = token.accessToken
      return session
    },
    async jwt({ token, account }) {
      if (account) {
        console.log('Account in jwt callback', JSON.stringify(account, null, 2))

        token.accessToken = account.access_token
      }
      return token
    }
  }
}

export default NextAuth(authOptions)
