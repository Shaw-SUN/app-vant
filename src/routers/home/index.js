let routes = [
  // 首页
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/Index.vue'),
    meta: {
      title: '文明吹哨我来拍',
      keepAlive: false
    },
  },
]

routes = [...routes]

export default routes
