import ERC20_ABI from '@/abi/erc20.json'
import { ApproveData, PairItem } from '@/types/app'
import Web3 from 'web3'
import { POLYGON_RPC } from '@/config'
import { valueToBigNumber } from '@/utils/math'

export function useApprove() {
  const web3 = new Web3(POLYGON_RPC)

  //批量查询所有 token 对 sender 合约的 allowance
  const batchTokenAllowance = async ({
    proxy = '0xed9a49977b8a12dc050169933a57999a2415a930',
    list,
    sender = '0x9b459093F897fAc5DeD105990baa244098FE84c8',
  }: {
    proxy?: string
    list: PairItem[]
    sender?: string
  }) => {
    const batch = new web3.BatchRequest()
    const ERC20Contract = new web3.eth.Contract(
      ERC20_ABI,
      list[0].tokenAddress,
    ) as any

    list.forEach((item) => {
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
    result.forEach((item, index) => {
      list[index].allowance = valueToBigNumber(item.result as string).toString()
    })
    return list
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

  const signApprove = ({
    amountDecimal,
    approveToken,
    spender,
  }: ApproveData) => {
    const data = getApproveData({ amountDecimal, approveToken, spender })
    console.log(data)
  }

  return {
    signApprove,
    batchTokenAllowance,
  }
}
