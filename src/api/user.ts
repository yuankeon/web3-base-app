import { request } from '@/utils/request'

// 用户登录后获取自己的信息
export function getUserInfo() {
  return request<any, any>({
    url: '/defed/user/account/me',
    method: 'GET',
  })
}

//钱包获取nonce
export function getNonce(account: string) {
  return request<any, any>({
    url: '/defed/user/wallet/getNonce',
    method: 'GET',
    params: {
      address: account,
    },
  })
}

//获取jwt token
export function postToken(account: string, signature: string) {
  return request<any, any>({
    url: '/defed/user/wallet/signup',
    method: 'POST',
    data: {
      address: account,
      signature,
    },
  })
}
