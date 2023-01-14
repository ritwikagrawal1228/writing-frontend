declare namespace NodeJS {
  interface ProcessEnv {
    readonly COGNITO_CLIENT_ID: string
    readonly COGNITO_CLIENT_SECRET: string
    readonly COGNITO_ISSUER: string
    readonly NEXTAUTH_URL: string
    readonly NEXTAUTH_SECRET: string
    readonly API_URL: string
    readonly SQUARE_APPLICATION_ID: string
    readonly SQUARE_ACCESS_TOKEN: string
    readonly SQUARE_LOCATION_ID: string
  }
}
