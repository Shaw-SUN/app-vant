<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
/* eslint-disable */
/* document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
  WeixinJSBridge.call('hideOptionMenu')
})
import { jssdksign } from '@/service/oauth-wechat'
import { initWX } from '@/utils/wxsdk.js' */

export default {
  components: {},
  created() {
    window.addEventListener(
      'orientationchange',
      function () {
        if (window.orientation == 90 || window.orientation == -90) {
          console.log('横屏了')
        }
      },
      false
    )

/*     jssdksign().then((res) => {
      let data = res
      const param = {
        appid: data.appid,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature
      }
      initWX(param)
    }) */
  },
  mounted() {
    // console.log(process.env.NODE_ENV)
    const client_width = document.body.clientWidth
    if (client_width > 750) {
      const ratio = 750 / client_width
      const $app = document.getElementById('app')
      const app_height = $app.clientHeight
      console.log(app_height)
      $app.style.height = app_height / ratio + 'px'
      $app.style.transform = 'scale(' + ratio + ')'
      $app.style.transformOrigin = 'top'
    }
  }
}
</script>
<style lang="stylus">
#app {
  width: 100%;
  height: 100%
  // padding: 100px 0 100px
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: env(safe-area-inset-bottom);
}
input,
select,
textarea,
button {
  -webkit-appearance: none;
}
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 100px white inset;
}
html {
  -webkit-overflow-scrolling: touch;
}
.no-data-list{
  flex:1;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height:100%;
  .no-data-pic{
    width:50%;
    margin-bottom:30px;
  }
  .tips-text{
    font-size:28px;
    color:#999999
  }
}
// loading-box
.loading-box {
  position :fixed;
  background :rgba(0,0,0,0.5)
  border-radius :10px;
  width :140px;
  height :140px;
  left: 50%;
  top: 50%;
  color:#fff;
  transform: translate(-50%, -50%);
  z-index: 9000;
  .loading {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align :center;
  }
}
</style>
