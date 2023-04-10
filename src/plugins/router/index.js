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
  base: '/',
  mode: 'history',
  routes
})

/* router.beforeEach((to, from, next) => {
 
})

router.afterEach(() => {

}) */

export default {
  router
}
