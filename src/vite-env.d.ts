/// <reference types="vite/client" />

declare module '@metamask/jazzicon' {
  export default function (diameter: number, seed: number): HTMLElement
}

interface Window {
  phantom?: {
    ethereum?: {
      isPhantom?: true
    }
  }
  ethereum?: {
    // set by the Brave browser when using built-in wallet
    isBraveWallet?: true
    // set by the Coinbase Wallet mobile dapp browser
    isCoinbaseWallet?: true
    // set by the MetaMask browser extension (also set by Brave browser when using built-in wallet)
    isMetaMask?: true
    // set by the Rabby browser extension
    isRabby?: true
    // set by the Trust Wallet browser extension
    isTrust?: true
    // set by the Ledger Extension Web 3 browser extension
    isLedgerConnect?: true
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
