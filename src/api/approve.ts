import { ApproveInterface } from '@/types/app'
import { request } from '@/utils/request'

export function getTokens() {
  return request<any, any>({
    url: '/defed/dex/getPairList',
    method: 'GET',
  })
}

export function proxyApprove(params: ApproveInterface) {
  return request<any, any>({
    url: '/defed/user/approveToken',
    method: 'POST',
    data: params,
  })
}
