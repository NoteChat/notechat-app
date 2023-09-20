/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RENDERER_VITE_REMOTE_API: string
  readonly RENDERER_VITE_STRIPE_TABLE_ID: string
  readonly RENDERER_VITE_STRIPE_API_KEY: string
  readonly RENDERER_VITE_COOKIE_DOMAIN: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
