import { Web3ReactHooks } from '@web3-react/core'
import { Connector } from '@web3-react/types'

export enum ConnectionType {
  INJECTED = 'INJECTED',
  COINBASE_WALLET = 'COINBASE_WALLET',
  WALLET_CONNECT_V2 = 'WALLET_CONNECT_V2',
}

export interface Connection {
  getName(): string
  connector: Connector
  hooks: Web3ReactHooks
  type: ConnectionType
  getIcon?(isDarkMode: boolean): string
  shouldDisplay(): boolean
  overrideActivate?: () => boolean
}

export type Wallet = ConnectionType | undefined
