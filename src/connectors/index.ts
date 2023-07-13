/**
 * 各种钱包的 connectors
 * https://github.com/Uniswap/web3-react/blob/main/example/components/ProviderExample.tsx
 */
import { Web3ReactHooks } from '@web3-react/core'
import type { MetaMask } from '@web3-react/metamask'
import type { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import type { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'

import { hooks as metaMaskHooks, metaMask } from './metaMask'
import { coinbaseWallet, hooks as coinbaseWalletHooks } from './coinbase'
import {
  hooks as walletConnectV2Hooks,
  walletConnectV2,
} from './walletConnectV2'

export const connectors: [
  MetaMask | WalletConnectV2 | CoinbaseWallet,
  Web3ReactHooks,
][] = [
  [metaMask, metaMaskHooks],
  [walletConnectV2, walletConnectV2Hooks],
  [coinbaseWallet, coinbaseWalletHooks],
]
