<template>
  <div class="page-container">
    <van-nav-bar :title="title + '健身房'" left-text="返回" right-text="确定" left-arrow @click-left="onClickLeft" @click-right="onClickRight" />
    <van-cell-group>
      <van-form ref="infoForm">
        <van-field v-model="infoForm.name" label="名称" clearable placeholder="请输入" :rules="[{ required: true, message: '请填写名称' }]" v-if="title !== '编辑'" />
        <van-field v-model="infoForm.address" label="地址" clearable placeholder="请输入" :rules="[{ required: true, message: '请填写地址' }]" />
        <van-field v-model="infoForm.phone" type="tel" label="联系电话" clearable placeholder="请输入" :rules="[{ required: true, message: '请填写联系电话' }]" />
        <van-field v-model="infoForm.area" type="number" label="占地面积" clearable placeholder="平方米" :rules="[{ required: true, message: '请填写占地面积' }]" />
        <van-field v-model="infoForm.content" label="详情" clearable rows="2" type="textarea" placeholder="请输入" :rules="[{ required: true, message: '请填写详情' }]" />
        <van-field v-model="infoForm.time" label="运营时间" clearable placeholder="例 8：00-10：00" :rules="[{ required: true, message: '请填写运营时间' }]" />
        <!-- <van-field readonly clickable name="datetimePicker" :value="infoForm.time" label="运营时间" placeholder="点击选择时间" @click="showTimePicker = true" :rules="[{ required: true, message: '请填写时间' }]" />
        <van-popup v-model="showTimePicker" position="bottom">
          <van-datetime-picker type="date" @confirm="onConfirm" @cancel="showTimePicker = false" :min-date="minDate" :max-date="maxDate" />
        </van-popup> -->
        <van-field name="uploader1" label="Logo">
          <template #input>
            <van-uploader v-model="uploader1" multiple :max-count="1" :after-read="afterRead1" />
          </template>
        </van-field>
        <van-field name="uploader2" label="详情封面">
          <template #input>
            <van-uploader v-model="uploader2" multiple :max-count="1" :after-read="afterRead2" />
          </template>
        </van-field>
        <van-field name="uploader3" label="营业执照" v-show="title !== '编辑'">
          <template #input>
            <van-uploader v-model="uploader3" multiple :max-count="1" :after-read="afterRead3" />
          </template>
        </van-field>
      </van-form>
    </van-cell-group>
  </div>
</template>

<script>
import { registerGym, getUserGym, editGym } from '@/service/user'
import { parseTime, getTimestamp } from '@/utils/js-tools'
import { uploadFile } from '@/service/upload'

export default {
  data() {
    return {
      title: '',
      currentTime: '',
      infoForm: {
        name: '',
        address: '',
        phone: '',
        area: '',
        content: '',
        logoUrl: '',
        detailUrl: '',
        auditUrl: '',
        longitude: '',
        latitude: ''
      },
      //日期选择器
      showTimePicker: false,
      minDate: new Date(1971, 1, 1),
      maxDate: new Date(2023, 1, 1),
      uploader1: [],
      uploader2: [],
      uploader3: []
    }
  },
  mounted() {
    this.title = this.$route.query.action
    this.getLocation()
    this.getInfo()
  },
  methods: {
    getInfo() {
      if (this.title === '编辑') {
        getUserGym().then((res) => {
          this.infoForm = res.data
          this.uploader1.push({ url: res.data.logoUrl, isImage: true })
          this.uploader2.push({ url: res.data.detailUrl, isImage: true })
          this.uploader3.push({ url: res.data.auditUrl, isImage: true })
        })
      }
    },
    onClickLeft() {
      this.$router.go(-1)
    },
    onClickRight() {
      if (this.title === '注册') {
        this.$refs.infoForm.validate().then(() => {
          //this.infoForm.time = getTimestamp(this.infoForm.time, 10)
          registerGym(this.infoForm).then((res) => {
            this.$toast('注册成功')
            this.$router.go(-1)
          })
        })
      } else if (this.title === '编辑') {
        this.$refs.infoForm.validate().then(() => {
          editGym(this.infoForm).then((res) => {
            this.$toast('成功')
            this.$router.go(-1)
          })
        })
      }
    },
    /**获取地图定位*/
    getLocation() {
      let that = this
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            that.infoForm.longitude = position.coords.longitude
            that.infoForm.latitude = position.coords.latitude
            /* alert('经度：' + position.coords.latitude)
            alert('纬度：' + position.coords.longitude) */
          },
          function (error) {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                alert('用户拒绝对获取地理位置的请求。')
                break
              case error.POSITION_UNAVAILABLE:
                alert('位置信息是不可用的。')
                break
              case error.TIMEOUT:
                alert('请求用户地理位置超时。')
                break
              case error.UNKNOWN_ERROR:
                alert('未知错误。')
                break
            }
          },
          { enableHighAcuracy: true }
        )
      } else {
        alert('Geolocation is not supported by this browser.')
      }
    },
    onConfirm(time) {
      this.infoForm.time = parseTime(time, '{y}-{m}-{d}')
      this.showTimePicker = false
    },
    afterRead1(file) {
      //console.log(file)
      let formData = new FormData()
      formData.append('file', file.file)
      uploadFile(formData).then((res) => {
        this.infoForm.logoUrl = res.url
      })
    },
    afterRead2(file) {
      //console.log(file)
      let formData = new FormData()
      formData.append('file', file.file)
      uploadFile(formData).then((res) => {
        this.infoForm.detailUrl = res.url
      })
    },
    afterRead3(file) {
      //console.log(file)
      let formData = new FormData()
      formData.append('file', file.file)
      uploadFile(formData).then((res) => {
        this.infoForm.auditUrl = res.url
      })
    }
  }
}
</script>

<style></style>
