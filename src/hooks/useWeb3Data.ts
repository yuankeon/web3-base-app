import { useWeb3React } from '@web3-react/core'

export function useWeb3Data() {
  const { provider, account } = useWeb3React()

  //v4 签名
  const signTxData = async (unsignedData: string): Promise<string> => {
    if (provider && account) {
      const signature: string = await provider.send('eth_signTypedData_v4', [
        account,
        unsignedData,
      ])

      return signature
    }
    throw new Error('Error initializing permit signature')
  }

  // 登录签名
  const signPersonalData = async (unsignedData: string): Promise<string> => {
    if (provider && account) {
      const signature: string = await provider.send('personal_sign', [
        unsignedData,
        account,
      ])

      return signature
    }
    throw new Error('Error initializing permit signature')
  }

  return {
    signTxData,
    signPersonalData,
  }
}
