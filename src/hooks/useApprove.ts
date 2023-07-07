import ERC20_ABI from '@/abi/erc20.json'
import { EnvMap } from '@/config'
import { ApproveData } from '@/types/app'
import Web3 from 'web3'

//授权合约：toAddress
export function useApprove() {
  const web3 = new Web3(EnvMap['dev'].rpc)

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
  }
}
