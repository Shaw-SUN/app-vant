<template>
  <div class="page-container">
    <van-nav-bar title="我的健身房" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-cell title="暂无健身房" value="注册" is-link @click="toRegister('注册')" v-if="info.state == 4"></van-cell>
    <div v-if="info.state !== 4">
      <van-cell is-link center value="编辑" @click="toRegister('编辑')">
        <template #title>
          <div class="header">
            <div><van-image round width="50" height="50" :src="info.logoUrl" /></div>
            <div class="name">{{ info.name }}</div>
          </div>
        </template>
      </van-cell>
      <van-cell title="地址" :value="info.address"></van-cell>
      <van-cell title="电话" :value="info.phone"></van-cell>
      <van-cell title="营业时间" :value="info.time"></van-cell>
      <van-cell title="占地面积" :value="info.area + ' 平方米'"></van-cell>
      <van-cell title="详情">
        <template #default>
          <div>{{ info.content }}</div>
          <van-image width="75" height="75" :src="info.detailUrl" />
        </template>
      </van-cell>

      <div v-if="info.state !== 1">
        <van-cell title="审核状态">
          <template #default>
            <div v-if="info.state == 2">审核中</div>
            <div v-if="info.state == 3">审核驳回</div>
          </template>
        </van-cell>
        <van-cell title="驳回原因" v-if="info.state == 3" :value="info.refuseReason"></van-cell>
      </div>

      <div v-if="info.state == 1" class="action" style="margin-bottom: 100px">
        <van-cell title="商品列表" is-link @click="toGoods(info.id)"></van-cell>
        <van-cell title="订单列表" is-link @click="toOrder()"></van-cell>
        <van-cell title="核销订单" is-link @click="useAction()"></van-cell>
        <van-cell title="注销健身房" is-link @click="cancelAction()"></van-cell>
      </div>
    </div>
    <van-dialog v-model="showDialog" title="核销" show-cancel-button @confirm="onsubmit()">
      <van-form ref="codeForm">
        <van-field v-model="codeForm.code" label="核销码" clearable placeholder="请输入" :rules="[{ required: true, message: '' }]" />
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import { getUserGym, cancelGym, gymUse } from '@/service/user'

export default {
  data() {
    return {
      info: {},
      codeForm: {
        code: ''
      },
      showDialog: false
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    getInfo() {
      getUserGym().then((res) => {
        this.info = res.data
      })
    },
    toRegister(action) {
      this.$router.push({
        path: '/my/gym-register',
        query: { action: action }
      })
    },
    toGoods(id) {
      this.$router.push({
        path: '/my/gym-goods',
        query: { id: id }
      })
    },
    toOrder() {
      this.$router.push({
        path: '/my/gym-order'
      })
    },
    cancelAction() {
      Dialog.confirm({
        message: '确认注销吗？'
      })
        .then(() => {
          cancelGym().then(() => {
            this.$toast('注销成功')
            this.$router.go(-1)
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    useAction() {
      this.showDialog = true
    },
    onsubmit() {
      this.$refs.codeForm
        .validate()
        .then(() => {
          gymUse(this.codeForm.code).then(() => {
            this.$toast('成功')
          })
        })
        .catch()
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
