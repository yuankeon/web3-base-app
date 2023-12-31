export interface PairItem {
  tokenAddress: string
  tokenName: string
  symbol: string
  allowance?: string
}

export interface ApproveInterface {
  to: string
  value: number
  data?: string
  operation: number
  nonce: number
  spender: string
  amount: string
  signature: string
  chainId: number | undefined
}

export interface AccountData {
  proxyAddress: string
  currentLoginAddress: string
  uid: number
  addressType: number
  username: string
  avatar: string
  email: string
  privateKey: string
}

export type UserData = AccountData | undefined

export interface ApproveData {
  amountDecimal: string
  approveToken: string
  spender: string
}

export type transactionType = {
  value?: string
  from?: string
  to?: string
  nonce?: number
  gasLimit?: number
  gasPrice?: string
  data?: string
  chainId?: number
}
