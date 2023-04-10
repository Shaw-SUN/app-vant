import gymRoutes from './gym.js'
import myRoutes from './personal.js'


let routes = [
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
  }
]

routes = [...myRoutes, ...gymRoutes, ...routes]

export default routes
