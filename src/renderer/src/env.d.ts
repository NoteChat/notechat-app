/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RENDERER_VITE_REMOTE_API: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
