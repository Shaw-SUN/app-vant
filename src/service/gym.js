import request from '@/utils/request'

export function getGymList(params) {
  return request.get(`/api/app/gym/list`, params)
}

export function getGymDetail(id) {
  return request.get(`/api/app/gym/detail/${id}`)
}

export function getGoodDetail(id) {
  return request.get(`/api/app/good/detail/${id}`)
}

export function buyGood(id) {
  return request.post(`/api/app/good/buy/${id}`)
}

export function putGood(id) {
  return request.post(`/api/good/put/${id}`)
}

export function pullGood(id) {
  return request.post(`/api/good/pull/${id}`)
}

export function deleteGood(id) {
  return request.delete(`/api/good/${id}`)
}