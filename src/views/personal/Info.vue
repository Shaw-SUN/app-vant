<template>
  <div class="page-container">
    <van-cell is-link center value="编辑个人信息" @click="edit('编辑个人信息')">
      <template #title>
        <div class="header">
          <div><van-image round width="50" height="50" :src="info.avatarUrl" /></div>
          <div class="name">{{ info.nickname }}</div>
        </div>
      </template>
    </van-cell>
    <van-cell title="账户余额" :value="info.account + ' 元'"></van-cell>

    <van-cell  class="action" title="我的健身房" is-link @click="toGym()"></van-cell>

    <van-cell class="action" title="修改密码" is-link @click="edit('修改密码')"></van-cell>
    <van-cell title="退出登录" is-link @click="quit"></van-cell>
  </div>
</template>

<script>
import { getUserInfo, logout } from '@/service/user'
import { removeToken } from '@/utils/auth'

export default {
  data() {
    return {
      info: {}
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      getUserInfo().then((res) => {
        this.info = res.data
      })
    },
    quit() {
      logout().then(() => {
        removeToken()
        this.$router.push('/login')
      })
    },
    edit(action) {
      this.$router.push({
        path: '/edit-info',
        query: { action: action }
      })
    },
    toGym() {
      this.$router.push({
        path: '/my/gym'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.header {
  display: flex
  align-items: center
  .name {
    margin-left 20px
  }
}
.action {
  margin-top: 20px
}
</style>
