import { request } from '@/utils/request'

const EnvMap: { [key: string]: string } = {
  dev: 'https://dev-legency.defed.finance',
  test: 'https://test-legency.defed.finance',
  prod: 'https://v2.defed.finance',
}

const GET_TOKEN_URL = '/defed/dex/getPairList'

export function getTokens(env = 'dev') {
  return request<any, any>({
    url: `${EnvMap[env]}${GET_TOKEN_URL}`,
    method: 'GET',
  })
}
