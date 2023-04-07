import axios from 'axios'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorode'
// import getSignature from './signature'
import { Toast } from 'vant'
import qs from 'qs'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  // baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 30000
})
let cancelToken = axios.CancelToken
const source = cancelToken.source()
let preventDefault = false
let preventDefaultNet = false

// request拦截器
service.interceptors.request.use(
  (config) => {
    const { url } = config
    preventDefault = config.preventDefault
    preventDefaultNet = config.preventDefaultNet
    // url含有undefined取消请求
    if (url.includes('undefined')) {
      console.log('参数错误：' + url)
      source.cancel()
      config.cancelToken = source.token
    }
    if (process.env.NODE_ENV !== 'development') {
      config.baseURL = process.env.VUE_APP_BASE_API
      if (url.startsWith('/api/news')) {
        config.baseURL = process.env.VUE_APP_FANGYI_API
      }
      if (url.startsWith('/api/v4')) {
        config.baseURL = process.env.VUE_APP_BASE_APP
      }
      if (url.startsWith('/api/rongzhengwu') || url.startsWith('/api/vod')) {
        config.baseURL = process.env.VUE_APP_BASE_CAPP
      }
      // 文件上传服务--修改头像
      console.log(url)
      console.log(url.startsWith('/v4/avatars'))
      console.log(process.env.VUE_APP_BASE_FILE)

      if (url.startsWith('/v4/avatars')) {
        config.baseURL = process.env.VUE_APP_BASE_FILE
      }
    }
    // // 拷贝自今吴江云城市签名
    // if (config.params) {
    //   Object.assign(config.params, getSignature())
    //   Object.assign(config.params, { client_id: 320505 })
    // } else if (config.data) {
    //   Object.assign(config.data, getSignature())
    //   Object.assign(config.data, { client_id: 320505 })
    // }
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    if (getToken() && !isToken) {
      config.headers['X-Authorization'] ='Bearer '+ getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // 如果设置了Content-Type: "multipart/form-data"
    if (config.headers && config.headers['Content-Type'] == 'multipart/form-data') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      config.data = qs.stringify(config.data)
    } else {
      // get请求映射params参数
      if (config.params) {
        config.params = qs.parse(qs.stringify(config.params))
      }
      if (config.data) {
        config.data = qs.parse(qs.stringify(config.data))
      }
    }
    // console.log(config, 'config')
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200
    if (code == 200) {
      return res.data
    } else {
      // 是否取消默认处理
      if (preventDefault) {
        res.data.type = '1'
        return Promise.reject(res.data)
      } else {
        // 获取错误信息
        const msg = errorCode[code] || res.data.msg || errorCode['default']

        Toast(msg)
        // return Promise.reject(new Error(msg))
        return Promise.reject({
          type: '1',
          message: msg
        })
      }
    }
  },
  (error) => {
    if (preventDefaultNet) {
      return Promise.reject({
        type: '0',
        message: '网络错误',
        error
      })
    } else {
      let { message } = error
      if (message == 'Network Error') {
        message = '后端接口连接异常'
      } else if (message.includes('timeout')) {
        message = '系统接口请求超时'
      } else if (message.includes('Request failed with status code')) {
        message = '系统接口' + message.substr(message.length - 3) + '异常'
      }
      Toast(message)
      return Promise.reject({
        type: '0',
        message: '网络错误',
        error
      })
    }
  }
)

// 二次封装(统一传参)

function request(url, data, config) {
  const firstArg = url
  if (typeof firstArg == 'object') {
    const { url, method, data } = firstArg
    if (method == 'get' || method == 'delete') {
      return service[method](url, { params: data, ...config })
    } else if (method == 'post' || method == 'put') {
      return service[method](url, data, config)
    }
  } else {
    return service.get(url, { params: data, ...config })
  }
}

request.get = (url, data, config) => service.get(url, { params: data, ...config })
request.delete = (url, data, config) => service.delete(url, { params: data, ...config })
request.put = (url, data, config) => service.put(url, data, config)
request.post = (url, data, config) => service.post(url, data, config)

export default request
