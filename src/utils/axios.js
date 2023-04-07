import Vue from 'vue'
import axios from 'axios'
import _ from 'lodash'
import qs from 'querystringify'
import { Toast } from 'vant'
// 取消重复请求
let pending = []
let cancelToken = axios.CancelToken
const source = cancelToken.source()

// 去重请求
let removePending = (config) => {
  /* eslint-disable */
  for (let p in pending) {
    if (pending[p].u ===  config.url + '&' + config.method) {
      pending[p].f()
      pending.splice(p, 1)
    }
  }
}

// 验证请求是否存在
let cutReq = (config) => {
  const url = config.url
  for (let p in pending) {
    if (pending[p].u === url + '&' + config.method) {
      return true
    }
  }
}

// create an axios instance
const service = axios.create({
  // withCredentials: true, // send cookies when cross-domain requests
  baseURL: process.env.NODE_ENV != 'development' ? process.env.VUE_APP_BASE_API : '', // url = base url + request url
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    const { method, data, contentType, url } = config
    let flag = cutReq(config)
    if (flag === true) return null
    config.cancelToken = new cancelToken((c) => {
      const url = config.url
      pending.push({ u: url + '&' + config.method, f: c })
    })
    // 拦截url中包含undefined的请求
    if (url.indexOf('undefined') > -1) {
      console.log('参数错误：' + url)
      source.cancel()
      config.cancelToken = source.token
      return
    }
    // parse data
    if (contentType === 'json') {
      config.headers['Content-Type'] = 'application/json'
    } else if (method !== 'get' && _.isObject(data)) {
      if (typeof config.headers['Content-Type'] === 'undefined') {
        // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        config.data = qs.stringify(data)
      }
    }
    // 设置请求头
    if (sessionStorage.getItem('Authorization')) {
      config.headers['X-Authorization'] ='Bearer '+sessionStorage.getItem('Authorization') // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log('---error---')
    console.log(error) // for debug
    pending = []
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    // console.log(response, 'response')
    const res = response.data
    removePending(response.config)
    // 如果请求成功
    if (response.status == 200) {
      return res
    } else {
      Toast('请求失败，请重新加载！')
      return Promise.reject(res.message || 'Error')
    }
  },
  (error) => {
    console.log('网络错误： ' + error)
    pending = []
    Toast('网络异常请稍后重试！')
    return Promise.reject(error)
  }
)

Vue.$request = service
export default service
