<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <tab v-if="$route.path !== '/login'"></tab>
  </div>
</template>
<script>
import Tab from '@/views/Tab.vue'
export default {
  components: { Tab },
  mounted() {
    const client_width = document.body.clientWidth
    if (client_width > 750) {
      const ratio = 750 / client_width
      const $app = document.getElementById('app')
      const app_height = $app.clientHeight
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
.page-container {
  width: 100%
  height: 100%
  overflow-y: scroll;
  background-color #fafafa
}
</style>
