export const getTypeDataV2 = (
  message: any,
  chainId: string,
  verifyingContract: string,
) => {
  return {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      ExecTransaction: [
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'data', type: 'bytes' },
        { name: 'operation', type: 'uint8' },
        { name: 'nonce', type: 'uint256' },
      ],
    },
    primaryType: 'ExecTransaction',
    domain: {
      name: 'Defed Wallet',
      version: '1',
      chainId: chainId || '1',
      verifyingContract: verifyingContract,
    },
    message,
  }
}
