/// <reference types="vite/client" />

declare module '@metamask/jazzicon' {
  export default function (diameter: number, seed: number): HTMLElement
}

interface Window {
  ethereum?: {
    on: (event: string, callback: () => void) => void
    removeListener: (event: string, callback: () => void) => void
  }
}

interface ImportMetaEnv {
  readonly VITE_APPURL: string
  readonly VITE_POLYGON_RPC: string
  readonly VITE_CONTRACT_PROXYADMIN: string
  readonly VITE_USER_NODE_ENV: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
