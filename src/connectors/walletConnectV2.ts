import { initializeConnector } from '@web3-react/core'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'

export const [walletConnectV2, hooks] = initializeConnector<WalletConnectV2>(
  (actions) =>
    new WalletConnectV2({
      actions,
      options: {
        projectId: 'c6c9bacd35afa3eb9e6cccf6d8464395',
        chains: [1],
        optionalChains: [137],
        showQrModal: true,
      },
    }),
)
