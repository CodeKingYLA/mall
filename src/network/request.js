//封装网络模块
import axios from 'axios'

export function request(config) {
  const instance = axios.create({
    baseURL: '接口',
    timeout: 5000
  })
  //axios拦截器
  instance.interceptors.request.use(config => {
    return config
  }, err => {

  })

  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err);
  })

  //发送网络请求
  return instance(config) //把Promise对象返回
}


