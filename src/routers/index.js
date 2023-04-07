import homeRouter from './home'
let routes = [
  // 404
  {
    path: '*',
    name: '404',
    component: () => import('@/views/404.vue'),
    meta: {
      title: '页面不见了'
    }
  }
]

routes = [...homeRouter, ...routes]

export default routes
