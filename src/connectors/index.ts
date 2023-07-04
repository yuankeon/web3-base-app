/**
 * 各种钱包的 connectors
 * https://github.com/Uniswap/web3-react/blob/main/example/components/ProviderExample.tsx
 */
import { Web3ReactHooks } from '@web3-react/core'
import type { MetaMask } from '@web3-react/metamask'
import { hooks as metaMaskHooks, metaMask } from './metaMask'

export const connectors: [MetaMask, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
]
