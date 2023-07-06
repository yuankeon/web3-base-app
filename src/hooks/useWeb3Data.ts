import type { transactionType } from '@/types/app'
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

  //matamask申请获取公钥
  const getEncryptionPublicKey = async (): Promise<string> => {
    if (provider && account) {
      const encryptionPublicKey = await provider.send(
        'eth_getEncryptionPublicKey',
        [account],
      )
      return encryptionPublicKey
    }
    throw new Error('Error initializing encryptionPublicKey')
  }

  //matamask使用私钥去解密公钥加密过的数据
  const decryptMessage = async (encryptedMessage: string): Promise<string> => {
    if (provider && account) {
      const message = await provider.send('eth_decrypt', [
        encryptedMessage,
        account,
      ])
      return message
    }
    throw new Error('Error initializing signature')
  }

  //发送交易
  const sendTx = async (txData: transactionType) => {
    if (provider) {
      const { from, ...data } = txData
      const signer = provider.getSigner(from)
      const txResponse = await signer.sendTransaction(data)
      return txResponse
    }
    throw new Error('Error sending transaction. Provider not found')
  }

  return {
    signTxData,
    signPersonalData,
    getEncryptionPublicKey,
    decryptMessage,
    sendTx,
  }
}
