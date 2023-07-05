export const EnvMap: {
  [key: string]: { http: string; rpc: string; admin: string }
} = {
  dev: {
    http: 'https://dev-legency.defed.finance',
    rpc: 'https://rpc.ankr.com/polygon_mumbai',
    admin: '0xC6E78C221e033A2bdfCcFAB8bc990ca00D1c055e',
  },
  test: {
    http: 'https://test-legency.defed.finance',
    rpc: 'https://rpc.ankr.com/polygon_mumbai',
    admin: '0x3c813C7E07Ab917D46Da7DFd8B59393F5BBAD305',
  },
  prod: {
    http: 'https://v2.defed.finance',
    rpc: 'https://rpc.ankr.com/polygon',
    admin: '0x3c813C7E07Ab917D46Da7DFd8B59393F5BBAD305',
  },
}

export const TITLE = [
  {
    title: 'Token',
    width: '25%',
  },
  {
    title: 'Allowance',
    width: '25%',
  },
  {
    title: 'Amount',
    width: '25%',
  },
  {
    title: 'Action',
    width: '25%',
  },
]

export * from './tokens'
export * from './sign'
