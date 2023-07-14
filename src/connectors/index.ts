/**
 * 各种钱包的 connectors
 * https://github.com/Uniswap/web3-react/blob/main/example/components/ProviderExample.tsx
 */
import { Web3ReactHooks } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import type { MetaMask } from '@web3-react/metamask'
import type { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import type { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'

import { hooks as metaMaskHooks, metaMask } from './metaMask'
import { coinbaseWallet, hooks as coinbaseWalletHooks } from './coinbase'
import {
  hooks as walletConnectV2Hooks,
  walletConnectV2,
} from './walletConnectV2'
import { Connection, ConnectionType } from '@/types/wallet'
import { isMobile } from '@/utils/userAgent'
import {
  getInjection,
  getIsCoinbaseWallet,
  getIsInjected,
  getIsMetaMaskWallet,
} from '@/utils/utils'

// Web3ReactProvider 使用
export const connectors: [
  MetaMask | WalletConnectV2 | CoinbaseWallet,
  Web3ReactHooks,
][] = [
  [metaMask, metaMaskHooks],
  [walletConnectV2, walletConnectV2Hooks],
  [coinbaseWallet, coinbaseWalletHooks],
]

//组件使用
export function getConnections() {
  return [
    injectedConnection,
    walletConnectV2Connection,
    coinbaseWalletConnection,
  ]
}

const getIsMetaMaskBrowser = () => isMobile && getIsMetaMaskWallet()

const getShouldAdvertiseMetaMask = () =>
  !getIsMetaMaskWallet() &&
  !isMobile &&
  (!getIsInjected() || getIsCoinbaseWallet())

const getIsGenericInjector = () =>
  getIsInjected() && !getIsMetaMaskWallet() && !getIsCoinbaseWallet()

const getIsInjectedMobileBrowser = () =>
  getIsCoinbaseWalletBrowser() || getIsMetaMaskBrowser()

const getIsCoinbaseWalletBrowser = () => isMobile && getIsCoinbaseWallet()

const injectedConnection: Connection = {
  getName: () => getInjection().name,
  connector: metaMask,
  hooks: metaMaskHooks,
  type: ConnectionType.INJECTED,
  getIcon: (isDarkMode: boolean) => getInjection(isDarkMode).icon,
  shouldDisplay: () =>
    getIsMetaMaskWallet() ||
    getShouldAdvertiseMetaMask() ||
    getIsGenericInjector(),
  // If on non-injected, non-mobile browser, prompt user to install Metamask
  overrideActivate: () => {
    if (getShouldAdvertiseMetaMask()) {
      window.open('https://metamask.io/', 'inst_metamask')
      return true
    }
    return false
  },
}

export const walletConnectV2Connection: Connection = {
  getName: () => 'WalletConnect',
  connector: walletConnectV2,
  hooks: walletConnectV2Hooks,
  type: ConnectionType.WALLET_CONNECT_V2,
  getIcon: () => 'walletconnect',
  shouldDisplay: () => !getIsInjectedMobileBrowser(),
}

const coinbaseWalletConnection: Connection = {
  getName: () => 'Coinbase Wallet',
  connector: coinbaseWallet,
  hooks: coinbaseWalletHooks,
  type: ConnectionType.COINBASE_WALLET,
  getIcon: () => 'coinbase',
  shouldDisplay: () =>
    Boolean(
      (isMobile && !getIsInjectedMobileBrowser()) ||
        !isMobile ||
        getIsCoinbaseWalletBrowser(),
    ),
  // If on a mobile browser that isn't the coinbase wallet browser, deeplink to the coinbase wallet app
  overrideActivate: () => {
    if (isMobile && !getIsInjectedMobileBrowser()) {
      window.open('https://go.cb-w.com/mtUDhEZPy1', 'cbwallet')
      return true
    }
    return false
  },
}

//获取当前的 Connetor 实例
export function getConnection(c: Connector | ConnectionType) {
  if (c instanceof Connector) {
    const connection = getConnections().find(
      (connection) => connection.connector === c,
    )
    if (!connection) {
      throw Error('unsupported connector')
    }
    return connection
  } else {
    switch (c) {
      case ConnectionType.INJECTED:
        return injectedConnection
      case ConnectionType.COINBASE_WALLET:
        return coinbaseWalletConnection
      case ConnectionType.WALLET_CONNECT_V2:
        return walletConnectV2Connection
    }
  }
}
