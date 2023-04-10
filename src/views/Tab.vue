<template>
  <div>
    <van-tabbar fixed z-index="999" route>
      <van-tabbar-item replace to="/gym/list" icon="guide-o">附近健身房</van-tabbar-item>
      <van-tabbar-item replace to="/order/list" icon="orders-o">我的订单</van-tabbar-item>
      <van-tabbar-item replace to="/my/info" icon="user-o">个人中心</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {}
}
</script>

<style></style>
