let gymRoutes = [
  {
    path: '/gym/list',
    name: 'Gym',
    component: () => import('@/views/gym/List.vue'),
    meta: {
      title: '附近健身房',
      keepAlive: false
    },
  },
]

export default gymRoutes
