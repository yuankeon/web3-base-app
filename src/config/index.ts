export const EnvMap: { [key: string]: string } = {
  dev: 'https://dev-legency.defed.finance',
  test: 'https://test-legency.defed.finance',
  prod: 'https://v2.defed.finance',
}

export const TITLE = [
  {
    title: 'Token',
    width: '25%',
  },
  {
    title: 'Allowance',
    width: '30%',
  },
  {
    title: 'Amount',
    width: '30%',
  },
  {
    title: 'Action',
    width: '15%',
  },
]

export * from './tokens'
export * from './sign'
