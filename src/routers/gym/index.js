let routes = [
  // 首页
  {
    path: '/list',
    name: 'Gym',
    component: () => import('@/views/gym/List.vue'),
    meta: {
      title: '首页',
      keepAlive: false
    },
  },
]

routes = [...routes]

export default routes
