let myRoutes = [
  {
    path: '/my/info',
    name: 'Info',
    component: () => import('@/views/personal/Info.vue'),
    meta: {
      title: '个人中心',
      keepAlive: true
    }
  },
  {
    path: '/edit-info',
    name: 'EditInfo',
    component: () => import('@/views/personal/EditInfo.vue'),
    meta: {
      title: '修改个人信息',
      keepAlive: false
    }
  },
  {
    path: '/order/list',
    name: 'OrderList',
    component: () => import('@/views/my-order/List.vue'),
    meta: {
      title: '个人订单',
      keepAlive: false
    }
  },
  {
    path: '/order/detail',
    name: 'OrderDetail',
    component: () => import('@/views/my-order/Detail.vue'),
    meta: {
      title: '订单详情',
      keepAlive: false
    }
  },
  {
    path: '/my/gym',
    name: 'MyGym',
    component: () => import('@/views/my-gym/Manage.vue'),
    meta: {
      title: '我的健身房',
      keepAlive: false
    }
  },
  {
    path: '/my/gym-register',
    name: 'Register',
    component: () => import('@/views/my-gym/Register.vue'),
    meta: {
      title: '注册健身房',
      keepAlive: false
    }
  },{
    path: '/my/gym-order',
    name: 'GymOrder',
    component: () => import('@/views/my-gym/OrderList.vue'),
    meta: {
      title: '健身房订单',
      keepAlive: false
    }
  },
  {
    path: '/my/gym-goods',
    name: 'GymGoods',
    component: () => import('@/views/my-gym/EditGoods.vue'),
    meta: {
      title: '健身房商品',
      keepAlive: false
    }
  }
]

export default myRoutes
