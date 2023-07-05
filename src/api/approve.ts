import { request } from '@/utils/request'

export function getTokens() {
  return request<any, any>({
    url: '/defed/dex/getPairList',
    method: 'GET',
  })
}
