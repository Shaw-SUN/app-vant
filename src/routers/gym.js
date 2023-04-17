let gymRoutes = [
  {
    path: '/gym/list',
    name: 'GymList',
    component: () => import('@/views/gym/List.vue'),
    meta: {
      title: '附近健身房',
      keepAlive: false
    }
  },
  {
    path: '/gym/detail',
    name: 'GymDetail',
    component: () => import('@/views/gym/GymDetail.vue'),
    meta: {
      title: '健身房详情',
      keepAlive: false
    }
  },
  {
    path: '/gym/good',
    name: 'GoodDetail',
    component: () => import('@/views/gym/GoodDetail.vue'),
    meta: {
      title: '商品详情',
      keepAlive: false
    }
  },
  {
    path: '/gym/comment',
    name: 'CommentDetail',
    component: () => import('@/views/gym/CommentDetail.vue'),
    meta: {
      title: '评论详情',
      keepAlive: false
    }
  }
]

export default gymRoutes
