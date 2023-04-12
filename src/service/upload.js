import request from '@/utils/request'
let config = {
  headers: {
    'Content-type': 'multipart/form-data;charset=UTF-8'
  }
}
export function uploadFile(data) {
  return request.post(`/api/upload`, data, config)
}
