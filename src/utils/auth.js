//获取token
export function getToken() {
  return sessionStorage.getItem('Authorization')
}

//设置token
export function setToken(token) {
  return sessionStorage.setItem('Authorization', token)
}

//移除token
export function removeToken() {
  return sessionStorage.removeItem('Authorization')
}
