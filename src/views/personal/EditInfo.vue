<template>
  <div class="page-container">
    <van-nav-bar :title="title" left-text="返回" right-text="确认修改" left-arrow @click-left="onClickLeft" @click-right="onClickRight" />

    <van-cell-group v-if="title === '修改密码'">
      <van-form ref="passwordForm">
        <van-field v-model="passwordForm.mobile" label="手机号" readonly type="tel" placeholder="请输入" :rules="[{ pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '请填写正确的手机号' }]" />
        <van-field v-model="passwordForm.code" center clearable label="短信验证码" placeholder="请输入" :rules="[{ required: true, message: '请填写验证码' }]">
          <template #button>
            <van-button size="small" round plain type="info" :disabled="sendStatus === 'loading'" @click="getCode(passwordForm.mobile)">{{ sendText }}</van-button>
          </template>
        </van-field>
        <van-field v-model="passwordForm.password" type="password" clearable placeholder="请输入" label="新密码" :rules="[{ required: true, message: '请填写新的密码' }]" />
      </van-form>
    </van-cell-group>

    <van-cell-group v-if="title === '编辑个人信息'">
      <van-form ref="infoForm">
        <van-field v-model="infoForm.nickname" label="姓名" clearable placeholder="请输入" :rules="[{ required: true, message: '请填写姓名' }]" />
        <van-field name="radio" label="性别">
          <template #input>
            <van-radio-group v-model="infoForm.gender" direction="horizontal">
              <van-radio name="1">男</van-radio>
              <van-radio name="2">女</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field readonly clickable name="datetimePicker" :value="infoForm.birthday" label="生日" placeholder="点击选择时间" @click="showTimePicker = true" :rules="[{ required: true, message: '请填写生日' }]" />
        <van-popup v-model="showTimePicker" position="bottom">
          <van-datetime-picker type="date" @confirm="onConfirm" @cancel="showTimePicker = false" :min-date="minDate" :max-date="maxDate" />
        </van-popup>
        <van-field name="uploader" label="头像">
          <template #input>
            <van-uploader v-model="uploader" multiple :max-count="1" :after-read="afterRead" />
          </template>
        </van-field>
      </van-form>
    </van-cell-group>
  </div>
</template>

<script>
import { getUserInfo, editUserInfo, changePassword, getCaptcha } from '@/service/user'
import { parseTime, getTimestamp } from '@/utils/js-tools'
import { uploadFile } from '@/service/upload'
import { removeToken } from '@/utils/auth'

export default {
  data() {
    return {
      title: '',
      infoForm: { nickname: '', gender: '1', avatarUrl: '', birthday: '' },
      passwordForm: {
        mobile: '',
        password: '',
        code: ''
      },
      //验证码
      sendText: '发送验证码',
      sendStatus: 'free',
      sendTimer: null,
      remainingTime: 0,
      //日期选择器
      showTimePicker: false,
      minDate: new Date(1971, 1, 1),
      maxDate: new Date(2023, 1, 1),
      uploader: []
    }
  },
  mounted() {
    this.title = this.$route.query.action
    this.getInfo()
  },
  methods: {
    getInfo() {
      getUserInfo().then((res) => {
        this.infoForm.nickname = res.data.nickname
        this.infoForm.avatarUrl = res.data.avatarUrl
        this.uploader.push({ url: res.data.avatarUrl, isImage: true })
        this.infoForm.birthday = parseTime(res.data.birthday * 1000, '{y}-{m}-{d}')
        this.infoForm.gender = `${res.data.gender}`
        this.passwordForm.mobile = res.data.mobile
      })
    },
    onClickLeft() {
      this.$router.go(-1)
    },
    onClickRight() {
      if (this.title === '编辑个人信息') {
        this.$refs.infoForm.validate().then(() => {
          this.infoForm.birthday = getTimestamp(this.infoForm.birthday, 10)
          editUserInfo(this.infoForm).then((res) => {
            this.$toast('修改成功')
            this.$router.go(-1)
          })
        })
      } else if (this.title === '修改密码') {
        this.$refs.passwordForm.validate().then(() => {
          changePassword(this.passwordForm).then(() => {
            this.$toast('修改成功,请重新登录')
            removeToken()
            this.$router.push('/login')
          })
        })
      }
    },
    getCode(mobileNumber) {
      if (this.sendStatus === 'loading') {
        return
      }
      let pattern1 = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      // 发送获取验证码的请求
      if (pattern1.test(mobileNumber)) {
        getCaptcha({ mobile: mobileNumber }).then(() => {
          // 更新按钮状态
          this.sendStatus = 'loading'
          this.sendText = '发送中...'

          // 设置倒计时
          this.remainingTime = 60
          this.sendTimer = setInterval(() => {
            if (this.remainingTime === 0) {
              clearInterval(this.sendTimer)
              this.sendTimer = null
              this.sendText = '获取验证码'
              this.sendStatus = 'free'
            } else {
              this.remainingTime--
              this.sendText = `${this.remainingTime} 秒后重试`
            }
          }, 1000)
        })
      } else {
        this.$toast('请输入手机号')
      }
    },
    onConfirm(time) {
      this.infoForm.birthday = parseTime(time, '{y}-{m}-{d}')
      this.showTimePicker = false
    },
    afterRead(file) {
      //console.log(file)
      let formData = new FormData()
      formData.append('file', file.file)
      uploadFile(formData).then((res) => {
        this.infoForm.avatarUrl = res.url
      })
    }
  }
}
</script>

<style></style>
