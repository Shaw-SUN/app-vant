<template>
  <div class="page-container">
    <van-nav-bar title="健身房详情" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-card :thumb="detail.logoUrl" class="card">
       <template #title>
            <div class="name">{{ detail.name }}</div>
          </template>
          <template #desc>
            <span>剩余：{{ detail.stock }} </span>
            <span>已售：{{ detail.sale }}</span>
          </template>
          <template #tags>
            <div><van-icon name="fire-o" color="#ee0a24" />{{ detail.frequency }}</div>
          </template>
          <template #num>
            <van-button size="mini" @click="toBuy(detail.id)">购买</van-button>
          </template>
    </van-card>
    <van-tabs v-model="activeName" sticky>
      <van-tab title="详情" name="detail">
        <div class="detail">
          <div class="content">{{ detail.mark }}</div>
          <van-image width="100" height="100" :src="detail.detailUrl" />
        </div>
      </van-tab>
      <van-tab title="评论" name="comments">
        <van-cell v-for="(item, index) in detail.commentList" :key="index" @click="toComment(item.id)">
          <template #title>
            <div class="content">{{ item.content }}</div>
            <div><van-image width="80" height="80" :src="item.picUrl" /></div>
          </template>
          <template #label>{{ parseTime(item.createdAt, '{y}-{m}-{d} {h}:{i}:{s}') }}</template>
          <template #default>
            <span><van-icon name="star" color="#ee0a24" /> {{ item.point }}</span>
          </template>
        </van-cell>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import { parseTime, getTimestamp } from '@/utils/js-tools'
import { getGoodDetail, buyGood } from '@/service/gym'
export default {
  data() {
    return {
      activeName: '',
      detail: {}
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    toComment(id) {
      this.$router.push({
        path: '/gym/comment',
        query: { id: id }
      })
    },
    getDetail() {
      getGoodDetail(this.$route.query.id).then((res) => {
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
  }
}
.content {
    margin-bottom: 30px
  }
</style>
