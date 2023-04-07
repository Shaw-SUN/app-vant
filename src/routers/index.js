import homeRouter from './gym'
let routes = [
  // 404
  {
    path: '*',
    name: '404',
    component: () => import('@/views/404.vue'),
    meta: {
      title: '页面不见了'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录'
    }
  },
]

routes = [...homeRouter, ...routes]

export default routes
