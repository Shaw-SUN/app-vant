import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '@/routers/index.js'
import { login, jssdksign } from '@/service/oauth-wechat'
import { initWX, updateWXShare, openWXAuth } from '@/utils/wxsdk.js'
Vue.use(VueRouter)
// const _base = process.env.NODE_ENV == 'development' ? '' : ''
export const router = new VueRouter({
  base: '/',
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title || '/u200e'
  }
  // sessionStorage.setItem('Authorization', 'eyJhbGciOiJIUzUxMiJ9.)

  if (isWeiXin()) {
    if (to.path == '/resident') {
      sessionStorage.setItem('Authorization', sessionStorage.getItem('WeChat-Authorization') || '')
    }
    let code = to.query.code

    let noLoginArr = [], // 无需授权地址白名单
      isCur = false,
      mustLogin = ['/resident'], //必须登录才能进去路由地址
      isMust = false
    // if (to.path == '/') {
    //   isCur = true
    // }
    for (let i of noLoginArr) {
      if (to.path.indexOf(i) != -1) {
        isCur = true
      }
    }
    for (let i of mustLogin) {
      if (to.path == i) {
        isMust = true
      }
    }
    console.log('进入路由')
    if (isCur) {
      //白名单内不做登录判断，直接next
      next()
    } else if (isMust && !sessionStorage.getItem('WeChat-Authorization')) {
      // 必须登录才能进去地址 未找到token 强行拉起授权
      openWXAuth()
    } else if (localStorage.getItem('isToAuth') == 1 && !code && localStorage.getItem('isAllowAuth') == 0) {
      // 已经去过授权网址 但未同意授权 直击放行
      next()
    } else if (sessionStorage.getItem('Authorization')) {
      next()
    } else {
      if (!code) {
        openWXAuth()
      } else {
        //如果有code，说明用户点击了授权  将获取到的code传递给后台
        login({ code })
          .then((token) => {
            sessionStorage.setItem('Authorization', token)
            sessionStorage.setItem('WeChat-Authorization', token)
            localStorage.setItem('isAllowAuth', 1)
            next()
          })
          .catch(() => {
            location.replace('/')
          })
      }
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  /* if (isWeiXin()) {
    let UA = navigator.userAgent
    let isios = !!UA.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    if (isios) {
      setTimeout(() => {
        // updateWXShare('沙家浜随手拍', '', location.origin, location.origin + '/static/images/share_logo.png')
      }, 500)
    } else {
      setTimeout(() => {
        jssdksign().then((res) => {
          let data = res
          const param = {
            appid: data.appid,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature
          }
          initWX(param)
          setTimeout(() => {
            // updateWXShare('沙家浜随手拍', '', location.origin, location.origin + '/static/images/share_logo.png')
          }, 500)
        })
      }, 500)
    }
  } */
})

/* function isWeiXin() {
  var ua = navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
} */
export default {
  router
}
