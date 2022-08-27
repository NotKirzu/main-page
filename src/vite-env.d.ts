/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DISCORD_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}