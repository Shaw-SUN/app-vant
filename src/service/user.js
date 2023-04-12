import request from '@/utils/request'

export function getCaptcha(params) {
  return request.get(`/api/user/send/code`, params)
}

export function passWordLogin(params) {
  return request.post(`/api/user/login`, params)
}

export function mobileLogin(params) {
  return request.post(`/api/user/login/sms`, params)
}

export function register(params) {
  return request.post(`/api/user/register`, params)
}