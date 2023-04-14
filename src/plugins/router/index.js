import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '@/routers/index.js'


/* const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
 */
Vue.use(VueRouter)
// const _base = process.env.NODE_ENV == 'development' ? '' : ''
export const router = new VueRouter({
  base: '/app',
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  // 判断路径是否是登录页
    if (to.path === '/login') {
  // 是登录页，执行下一步
      next();
    } else {
  // 不是登录页，判断本地有无 token
      let token = sessionStorage.getItem('Authorization');
      if (token === null || token === ' ') {
  // token 为空或不存在，跳转到登录页
        next('/login');
      } else {
        next();
      }
    }
  })

export default {
  router
}
