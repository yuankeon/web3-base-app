import { initializeConnector } from '@web3-react/core'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'

export const [coinbaseWallet, hooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        url: `https://${'mainnet'}.infura.io/v3/${'84842078b09946638c03157f83405213'}`,
        appName: 'web3-react',
      },
    }),
)
