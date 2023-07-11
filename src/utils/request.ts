/**
 * axios的二次封装：使用请求拦截器与响应拦截器
 */
import axios from 'axios'
import { EnvMap } from '@/config'

//第一步:利用axios对象的create方法,去创建axios实例(其他的配置:基础路径、超时的时间)
const request = axios.create({
  baseURL: EnvMap['test'].http, // axios请求接口时候自动携带的基础路径
  timeout: 10000, //超时的时间的设置
})

// request 实例添加请求拦截器
request.interceptors.request.use((config) => {
  //从缓存中获取 token 信息
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

//request 实例添加响应拦截器
request.interceptors.response.use(
  (response) => {
    //成功回调 => 简化数据
    if (response.data.code === 200) return response.data
    //【抛出需要客户端处理的错误】
    throw new Error(response.data.msg)
  },
  (error) => {
    //失败回调:处理http网络错误【处理服务器端的错误】
    return Promise.reject(error)
  },
)

export { request }
