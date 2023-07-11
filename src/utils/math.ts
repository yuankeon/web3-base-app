import { BigNumber } from 'bignumber.js'

type BigNumberValue = string | number

export const valueToBigNumber = (value: BigNumberValue) => new BigNumber(value)

//精度 => 移除精度
export const removeDecimals = (value: BigNumberValue, decimals: number) =>
  valueToBigNumber(value)
    .shiftedBy(decimals * -1)
    .toString()

//无精度 => 添加精度
export const addDecimals = (value: BigNumberValue, decimals: number) =>
  valueToBigNumber(value).shiftedBy(decimals).toString()
