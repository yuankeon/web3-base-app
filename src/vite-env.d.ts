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
