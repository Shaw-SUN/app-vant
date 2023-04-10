let myRoutes = [
  {
    path: '/my/info',
    name: 'Info',
    component: () => import('@/views/personal/Info.vue'),
    meta: {
      title: '个人中心',
      keepAlive: true
    }
  }
]

export default myRoutes
