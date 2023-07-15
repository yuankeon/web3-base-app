import { initializeConnector } from '@web3-react/core'
import {
  WalletConnect,
  WalletConnectConstructorArgs,
} from '@web3-react/walletconnect-v2'

const RPC_URLS = {
  1: 'https://mainnet.infura.io/v3/099fc58e0de9451d80b18d7c74caa7c1',
  5: 'https://goerli.infura.io/v3/099fc58e0de9451d80b18d7c74caa7c1',
  137: 'https://rpc.ankr.com/polygon',
  80001: 'https://rpc.ankr.com/polygon_mumbai',
}

export class WalletConnectV2 extends WalletConnect {
  constructor({
    actions,
    onError,
    qrcode = true,
  }: Omit<WalletConnectConstructorArgs, 'options'> & { qrcode?: boolean }) {
    // const darkmode = Boolean(window.matchMedia('(prefers-color-scheme: dark)'))
    super({
      actions,
      options: {
        projectId: 'c6c9bacd35afa3eb9e6cccf6d8464395',
        optionalChains: [137, 5, 80001],
        chains: [1],
        showQrModal: qrcode,
        rpcMap: RPC_URLS,
        // this set of optional methods fixes a bug we encountered where permit2 signatures were never received from the connected wallet
        // source: https://uniswapteam.slack.com/archives/C03R5G8T8BH/p1686858618164089?thread_ts=1686778867.145689&cid=C03R5G8T8BH
        optionalMethods: [
          'eth_signTypedData',
          'eth_signTypedData_v4',
          'eth_sign',
          'personal_sign',
        ],
        qrModalOptions: {
          desktopWallets: undefined,
          enableExplorer: true,
          explorerExcludedWalletIds: undefined,
          explorerRecommendedWalletIds: undefined,
          mobileWallets: undefined,
          privacyPolicyUrl: undefined,
          termsOfServiceUrl: undefined,
          themeMode: 'light', //darkmode ? 'dark' : 'light',
          walletImages: undefined,
        },
      },
      onError,
    })
  }
}

export const [walletConnectV2, hooks] = initializeConnector<WalletConnectV2>(
  (actions) => new WalletConnectV2({ actions }),
)
