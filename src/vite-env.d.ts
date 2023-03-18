/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_SERVER_URI: string
  readonly VITE_SQUARE_APPLICATION_ID: string
  readonly VITE_SQUARE_ACCESS_TOKEN: string
  readonly VITE_SQUARE_LOCATION_ID: string
  readonly VITE_GRAMMARLLY_CLIENT_ID: string
  readonly VITE_NEXT_PUBLIC_GA4_TRACKING_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
