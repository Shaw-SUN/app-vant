<template>
  <div class="page-container">
    <van-nav-bar title="评论详情" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-cell>
      <template #title>
        <div class="content">{{ item.content }}</div>
        <div><van-image width="100" height="100" :src="item.picUrl" /></div>
      </template>
      <template #label>{{ parseTime(item.createdAt, '{y}-{m}-{d} {h}:{i}:{s}') }}</template>
      <template #default>
        <span><van-icon name="star" color="#ee0a24" /> {{ item.point }}</span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import { parseTime, getTimestamp } from '@/utils/js-tools'
import { getCommentDetail, buyGood } from '@/service/gym'
export default {
  data() {
    return {
      activeName: '',
      item: {}
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
      getCommentDetail(this.$route.query.id).then((res) => {
        this.item = res.data
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
