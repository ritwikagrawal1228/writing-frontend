declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_URL: string
    readonly SQUARE_APPLICATION_ID: string
    readonly SQUARE_ACCESS_TOKEN: string
    readonly SQUARE_LOCATION_ID: string
    readonly GRAMMARLLY_CLIENT_ID: string
    readonly NEXT_PUBLIC_GA4_TRACKING_ID: string
  }
}
