import request from '@/utils/request'

export function getOrderList(params) {
  return request.get(`/api/order/list`, params)
}

export function commentOrder(params) {
  return request.post(`/api/order/comment`, params)
}

export function cancelOrder(id) {
  return request.post(`/api/order/cancel/${id}`)
}

export function deleteOrder(id) {
  return request.delete(`/api/order/${id}`)
}

export function getOrderDetail(id) {
  return request.get(`/api/order/${id}`)
}