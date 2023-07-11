import ERC20_ABI from '@/abi/erc20.json'
import { ApproveData, ApproveInterface, PairItem } from '@/types/app'
import Web3 from 'web3'
import { POLYGON_RPC, getTypeDataV2 } from '@/config'
import { valueToBigNumber } from '@/utils/math'
import { useWeb3Data } from './useWeb3Data'
import { useWeb3React } from '@web3-react/core'
import { proxyApprove } from '@/api/approve'

export function useApprove() {
  const web3 = new Web3(POLYGON_RPC)
  const { signTxData } = useWeb3Data()
  const { chainId } = useWeb3React()

  //批量查询所有 token 对 sender 合约的 allowance
  const batchTokenAllowance = async ({
    proxy,
    list,
    sender,
  }: {
    proxy?: string
    list: PairItem[]
    sender?: string
  }) => {
    const batch = new web3.BatchRequest()

    list.forEach((item) => {
      const ERC20Contract = new web3.eth.Contract(
        ERC20_ABI,
        item.tokenAddress,
      ) as any
      //构造jsonrpc请求，id 和 jsonrpc 非必选项
      const data = {
        data: ERC20Contract.methods.allowance(proxy, sender).encodeABI(),
        to: item.tokenAddress,
      }
      const request = {
        method: 'eth_call',
        params: [data, 'latest'],
      }
      batch.add(request)
    })

    const result = await batch.execute()
    const tokenList: PairItem[] = result.map((item, index) => ({
      ...list[index],
      allowance: valueToBigNumber(item.result as string).toString(),
    }))
    return tokenList
  }

  const getApproveData = ({
    amountDecimal,
    approveToken,
    spender,
  }: ApproveData) => {
    const ERC20Contract = new web3.eth.Contract(ERC20_ABI as any, approveToken)
    //@ts-expect-error approve ts类型监测错误
    return ERC20Contract.methods.approve(spender, amountDecimal).encodeABI()
  }

  const signApprove = async ({
    amountDecimal,
    approveToken,
    spender,
  }: ApproveData) => {
    const data = getApproveData({ amountDecimal, approveToken, spender })
    const nonce = Date.now()
    const message = {
      to: approveToken,
      value: 0,
      data: data,
      operation: 0,
      nonce,
    }
    const signData = getTypeDataV2(message, chainId)
    const signature = await signTxData(JSON.stringify(signData))
    const params: ApproveInterface = {
      spender,
      amount: amountDecimal,
      signature,
      chainId,
      ...message,
    }
    delete params.data

    const fetchData = await proxyApprove(params)
    if (fetchData.code === 200) {
      return fetchData.data
    } else {
      throw new Error(fetchData.msg)
    }
  }

  return {
    signApprove,
    batchTokenAllowance,
  }
}
