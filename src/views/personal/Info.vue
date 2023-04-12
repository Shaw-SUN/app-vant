<template>
  <div class="page-container">
    <van-cell is-link center value="编辑个人信息" label="用户名">
      <template #title>
        <span>头像</span>
      </template>
    </van-cell>

    <van-cell class="action" title="注册健身房" is-link></van-cell>
    <van-cell title="我的健身房" is-link></van-cell>

    <van-cell class="action" title="修改密码" is-link></van-cell>
    <van-cell title="退出登录" is-link></van-cell>
  </div>
</template>

<script>
export default {}
</script>

<style lang="stylus" scoped>
.action {
  margin-top: 20px
}
</style>
