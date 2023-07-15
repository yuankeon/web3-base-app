export function getShortAddress(account: string) {
  return `${account.substring(0, 6)}...${account.substring(
    account.length - 4,
    account.length,
  )}`
}

export function reduceData(data: any[]) {
  const result: any[] = []
  data.forEach((item) => {
    if (!result.find((_d) => _d.tokenAddress === item.tokenA)) {
      const tokenA = {
        tokenAddress: item.tokenA,
        tokenName: item.tokenAName,
        symbol: item.tokenASymbol,
      }
      result.push(tokenA)
    }

    if (!result.find((_d) => _d.tokenAddress === item.tokenB)) {
      const tokenB = {
        tokenAddress: item.tokenB,
        tokenName: item.tokenBName,
        symbol: item.tokenBSymbol,
      }
      result.push(tokenB)
    }
  })
  return result
}
