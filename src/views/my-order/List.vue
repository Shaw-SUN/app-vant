<template>
  <div class="page-container">
    <van-tabs v-model="active" @click="onClick">
      <van-tab title="全部"></van-tab>
      <van-tab title="未核销"></van-tab>
      <van-tab title="已核销"></van-tab>
      <van-tab title="已取消"></van-tab>
    </van-tabs>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="getList" class="list">
        <van-card v-for="(item, index) in list" :key="index" :desc="item.gymName" :price="item.price.toFixed(2)" thumb="https://img01.yzcdn.cn/vant/ipad.jpeg" class="card">
          <template #title>
            <div class="name">{{ item.goodName }}</div>
          </template>
          <template #tags>
            <div>{{ parseTime(item.createdAt * 1000) }}</div>
          </template>
          <template #num>
            <van-button size="mini" v-if="item.state == 1" @click="toDetail(item.id)">详情</van-button>
            <!-- <van-button size="mini" v-if="item.state == 1" @click="useAction(item.id)">核销</van-button> -->
            <van-button size="mini" v-if="item.state == 1" @click="cancelAction(item.id)">取消</van-button>
            <van-button size="mini" v-if="item.state == 2 && item.isComment == 0" @click="commentAction(item.id)">评价</van-button>
            <van-button size="mini" v-if="item.state == 2 && item.isComment == 1" disabled>已评价</van-button>
            <van-button size="mini" v-if="item.state == 3" @click="deleteAction(item.id)">删除</van-button>
          </template>
        </van-card>
      </van-list>
    </van-pull-refresh>
    <van-dialog v-model="showDialog" title="评价" show-cancel-button @confirm="onsubmit()">
      <van-form ref="commentForm">
        <van-field name="rate" label="评分">
          <template #input>
            <van-rate v-model="commentForm.point" />
          </template>
        </van-field>
        <van-field name="uploader" label="图片">
          <template #input>
            <van-uploader v-model="uploader" multiple :max-count="1" :after-read="afterRead" />
          </template>
        </van-field>
        <van-field v-model="commentForm.content" label="评价内容" clearable rows="2" type="textarea" placeholder="请输入" :rules="[{ required: true, message: '请填写内容' }]" />
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import { getOrderList, cancelOrder, deleteOrder, commentOrder, getOrderDetail } from '@/service/order'
import { uploadFile } from '@/service/upload'

export default {
  data() {
    return {
      active: 0,
      params: {
        state: 0,
        page: 1,
        size: 10
      },
      totalCount: 0,
      //列表
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      //评价
      showDialog: false,
      commentForm: {
        orderId: '',
        picUrl: '',
        content: '',
        point: 0
      },
      uploader: []
    }
  },
  mounted() {
    //this.getList()
  },
  methods: {
    onClick() {
      this.params.state = this.active
      this.refreshing = true
      this.onRefresh()
    },
    getList() {
      if (this.refreshing) {
        this.list = []
        this.params.page = 1
        this.refreshing = false
      }
      getOrderList(this.params).then((res) => {
        this.totalCount = res.data.totalCount
        this.params.page = res.data.currentPage
        this.list.push(...res.data.list)
        // 加载状态结束
        this.loading = false
        if (this.list.length >= this.totalCount) {
          this.finished = true
        }
      })
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.getList()
    },
    toDetail(id) {
      this.$router.push({
        path: '/order/detail',
        query: { id: id }
      })
    },
    commentAction(id) {
      this.showDialog = true
      this.commentForm = {
        orderId: id,
        picUrl: '',
        content: '',
        point: 0
      }
    },
    useAction(id) {
      getOrderDetail(id).then((res) => {
        let code = res.data.code
        Dialog.alert({
          message: `核销码为:${code}`
        }).then(() => {
          // on close
        })
      })
    },
    cancelAction(id) {
      Dialog.confirm({
        message: '确认取消吗？'
      })
        .then(() => {
          cancelOrder(id).then(() => {
            this.$toast('取消成功')
            this.refreshing = true
            this.onRefresh()
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    deleteAction(id) {
      Dialog.confirm({
        message: '确认删除吗？'
      })
        .then(() => {
          deleteOrder(id).then(() => {
            this.$toast('删除成功')
            this.refreshing = true
            this.onRefresh()
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    afterRead(file) {
      //console.log(file)
      let formData = new FormData()
      formData.append('file', file.file)
      uploadFile(formData).then((res) => {
        this.commentForm.picUrl = res.url
      })
    },
    onsubmit() {
      this.$refs.commentForm
        .validate()
        .then(() => {
          commentOrder(this.commentForm).then(() => {
            this.$toast('评价成功')
            this.refreshing = true
            this.onRefresh()
          })
        })
        .catch()
    }
  }
}
</script>

<style lang="stylus" scoped>
.location {
  padding 0 30px 15px 35px
}
.list {
  margin-top 20px
  .card {
    background-color #ffffff
    .name {
      font-size: 30px
      font-weight: 500
    }
    .tag {
      margin-right 10px
    }
  }
}
</style>
