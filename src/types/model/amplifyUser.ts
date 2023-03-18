export type AmplifyUser = {
  attributes: {
    sub: string
  }
  signInUserSession: {
    accessToken: {
      jwtToken: string
    }
    idToken: {
      jwtToken: string
    }
  }
}
