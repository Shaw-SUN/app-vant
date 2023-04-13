<template>
  <div class="page-container">
    <van-nav-bar title="商品列表" left-text="返回" left-arrow right-text="新增" @click-left="onClickLeft" @click-right="onClickRight" />
    <van-card v-for="(item, index) in detail.goodList" :key="index" :price="item.price.toFixed(2)" :thumb="item.logoUrl" class="card">
      <template #title>
        <div class="name">{{ item.name }}</div>
      </template>
      <template #desc>
        <span>剩余：{{ item.stock }} </span>
        <span>已售：{{ item.sale }}</span>
      </template>
      <template #tags>
        <div><van-icon name="fire-o" color="#ee0a24" />{{ item.frequency }}</div>
      </template>
      <template #num>
        <van-button size="mini" @click="edit(item.id)">编辑</van-button>
        <van-button size="mini" @click="put(item.id)">上架</van-button>
        <van-button size="mini" @click="pull(item.id)">下架</van-button>
        <van-button size="mini" @click="deleteAction(item.id)">删除</van-button>
      </template>
    </van-card>
    <van-dialog v-model="showDialog" show-cancel-button @confirm="onsubmit()">
      <van-form ref="goodForm">
        <van-field v-model="goodForm.name" label="名称" clearable placeholder="请输入" :rules="[{ required: true, message: '请填写名称' }]" />
        <van-field name="uploader1" label="Logo">
          <template #input>
            <van-uploader v-model="uploader1" multiple :max-count="1" :after-read="afterRead1" />
          </template>
        </van-field>
        <van-field name="uploader2" label="详情图">
          <template #input>
            <van-uploader v-model="uploader2" multiple :max-count="1" :after-read="afterRead2" />
          </template>
        </van-field>
        <van-field v-model="goodForm.mark" label="补充信息" clearable placeholder="请输入" :rules="[{ required: true, message: '请填写补充信息' }]" />
        <van-field v-model="goodForm.price" type="number" label="价格" clearable placeholder="元" :rules="[{ required: true, message: '请填写价格' }]" />
        <van-field v-model="goodForm.time" type="number" label="使用时间" clearable placeholder="小时" :rules="[{ required: true, message: '请填写使用时间' }]" />
        <van-field v-model="goodForm.frequency" type="number" label="每人可购买次数" clearable placeholder="次" :rules="[{ required: true, message: '请填写每人可购买次数' }]" />
        <van-field v-model="goodForm.stock" type="number" label="库存" clearable placeholder="个" :rules="[{ required: true, message: '请填写库存' }]" />
        <van-field readonly clickable name="datetimePicker" :value="goodForm.date" label="使用时间" placeholder="点击选择时间" @click="showTimePicker = true" :rules="[{ required: true, message: '请填写时间' }]" />
        <van-popup v-model="showTimePicker" position="bottom">
          <van-datetime-picker type="date" @confirm="onConfirm" @cancel="showTimePicker = false" :min-date="minDate" :max-date="maxDate" />
        </van-popup>
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
import { getGymDetail } from '@/service/gym'
import { addGood, editGood } from '@/service/user'
import { getGoodDetail, putGood, pullGood, deleteGood } from '@/service/gym'
import { parseTime, getTimestamp } from '@/utils/js-tools'
import { uploadFile } from '@/service/upload'

export default {
  data() {
    return {
      action: '',
      detail: {},
      //评价
      showDialog: false,
      goodForm: {},
      //日期选择器
      showTimePicker: false,
      minDate: new Date(1971, 1, 1),
      maxDate: new Date(2023, 1, 1),
      uploader1: [],
      uploader2: []
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    onClickRight() {
      this.goodForm = {}
      this.showDialog = true
      this.action = 'add'
    },
    edit(id) {
      getGoodDetail(id).then(() => {
        this.goodForm = res.data
      })
      this.showDialog = true
      this.action = 'edit'
    },
    put(id) {
      Dialog.confirm({
        message: '确认取消吗？'
      })
        .then(() => {
          putGood(id).then(() => {
            this.$toast('成功')
            this.refreshing = true
            this.onRefresh()
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    pull(id) {
      Dialog.confirm({
        message: '确认取消吗？'
      })
        .then(() => {
          pullGood(id).then(() => {
            this.$toast('成功')
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
        message: '确认取消吗？'
      })
        .then(() => {
          deleteGood(id).then(() => {
            this.$toast('成功')
            this.refreshing = true
            this.onRefresh()
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    getDetail() {
      getGymDetail(this.$route.query.id).then((res) => {
        this.detail = res.data
      })
    },
    onConfirm(time) {
      this.goodForm.date = parseTime(time, '{y}-{m}-{d}')
      this.showTimePicker = false
    },
    afterRead1(file) {
      //console.log(file)
      let formData = new FormData()
      formData.append('file', file.file)
      uploadFile(formData).then((res) => {
        this.goodForm.logoUrl = res.url
      })
    },
    afterRead2(file) {
      //console.log(file)
      let formData = new FormData()
      formData.append('file', file.file)
      uploadFile(formData).then((res) => {
        this.goodForm.detailUrl = res.url
      })
    },
    onsubmit() {
      this.$refs.goodForm
        .validate()
        .then(() => {
          if (this.action == 'add') {
            addGood(this.goodForm).then(() => {
              this.$toast('成功')
              this.refreshing = true
              this.onRefresh()
            })
          } else if (this.action == 'edit') {
            editGood(this.goodForm).then(() => {
              this.$toast('成功')
              this.refreshing = true
              this.onRefresh()
            })
          }
        })
        .catch()
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
