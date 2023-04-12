import request from '@/utils/request'

export function getGymList(params) {
  return request.get(`/api/app/gym/list`, params)
}