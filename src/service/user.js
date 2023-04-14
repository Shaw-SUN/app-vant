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

export function getUserInfo() {
  return request.get(`/api/user/info`)
}
export function logout() {
  return request.post(`/api/user/logout`)
}

export function editUserInfo(params) {
  return request.put(`/api/user/info`, params)
}

export function changePassword(params) {
  return request.put(`/api/user/change`, params)
}

export function getUserGym() {
  return request.get(`/api/gym/own`)
}

export function registerGym(params) {
  return request.post(`/api/gym/register`, params)
}
export function editGym(params) {
  return request.put(`/api/gym/own`, params)
}

export function getGymOrder(params) {
  return request.get(`/api/gym/order/list`, params)
}

export function cancelGym() {
  return request.post(`/api/gym/cancel/own`)
}

export function gymUse(code) {
  return request.post(`/api/order/use/${code}`)
}

export function addGood(params) {
  return request.post(`/api/good/add`, params)
}
export function editGood(params) {
  return request.put(`/api/good`, params)
}


export function getGymGoods() {
  return request.get(`/api/gym/good/own`)
}


export function getGymGoodDetail(id) {
  return request.get(`/api/gym/good/own/${id}`)
}

