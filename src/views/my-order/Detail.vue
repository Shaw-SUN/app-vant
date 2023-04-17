<template>
  <div class="page-container">
    <van-nav-bar title="订单详情" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-card class="card" thumb="https://img01.yzcdn.cn/vant/ipad.jpeg" :price="detail.price.toFixed(2)">
      <template #title>
        <div class="name">{{ detail.goodName }}</div>
      </template>
      <template #desc>
        <div>健身房：{{ detail.goodName }}</div>
        <div>下单时间：{{ parseTime(detail.createdAt) }}</div>
      </template>
      <template #tags> </template>
      <!-- <template #num>
            <van-button size="mini" @click="toBuy(detail.id)">购买</van-button>
          </template> -->
    </van-card>
    <van-tabs v-model="activeName" sticky>
      <van-tab title="核销码" name="detail">
        <div class="detail">
          <div class="content">{{ detail.code }}</div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import { parseTime, getTimestamp } from '@/utils/js-tools'
import { getGoodDetail } from '@/service/gym'
import { getOrderDetail } from '@/service/order'

export default {
  data() {
    return {
      activeName: '',
      detail: {},
      goodDetail: {}
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    getDetail() {
      getOrderDetail(this.$route.query.id).then((res) => {
        this.detail = res.data
      })
    },
    toBuy(id) {
      /* this.$router.push({
        path: '/gym/good',
        query: { id: id }
      }) */
      Dialog.confirm({
        message: '确认购买吗？'
      })
        .then(() => {
          buyGood(id).then(() => {
            this.$toast('购买成功')
          })
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
/deep/.card {
      background #ffffff
    .name {
      font-size: 30px
      font-weight: 500
    }
    .tag {
      margin-right 10px
    }
  }
.detail {
  padding: 40px
  .content {
    margin-bottom: 30px
    text-align: center
  }
}
.content {
    margin-bottom: 30px
  }
</style>
