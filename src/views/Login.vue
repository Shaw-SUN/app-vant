<template>
  <div class="page-container">
    <van-tabs v-model="loginType" background="transparent" class="tab-bar" color="#4f81c7">
      <van-tab title="密码登录" name="username" class="tabs">
        <van-cell-group inset>
          <van-form @submit="onSubmit">
            <van-field v-model="userForm.mobile" label="手机号" clearable type="tel" placeholder="请输入" :rules="[{ required: true, message: '请填写正确的手机号' }]" />
            <van-field v-model="userForm.password" type="password" clearable name="密码" placeholder="请输入" label="密码" :rules="[{ required: true, message: '请填写密码' }]" />
          </van-form>
        </van-cell-group>
      </van-tab>
      <van-tab title="短信登录" name="phone" class="tabs">
        <van-cell-group inset>
          <van-form @submit="onSubmit">
            <van-field v-model="mobileForm.mobile" label="手机号" clearable type="tel" placeholder="请输入" :rules="[{ required: true, message: '请填写正确的手机号' }]" />
            <van-field v-model="mobileForm.code" center clearable label="短信验证码" placeholder="请输入">
              <template #button>
                <van-button size="small" round plain type="info" :disabled="sendStatus === 'loading'" @click="getCode">{{ sendText }}</van-button>
              </template>
            </van-field>
          </van-form>
        </van-cell-group>
      </van-tab>
      <van-tab title="注册" name="register" class="tabs">
        <van-cell-group inset>
          <van-form @submit="onSubmit">
            <van-field v-model="registerForm.mobile" label="手机号" clearable type="tel" placeholder="请输入" :rules="[{ required: true, message: '请填写正确的手机号' }]" />
            <van-field v-model="registerForm.code" center clearable label="短信验证码" placeholder="请输入">
              <template #button>
                <van-button size="small" round plain type="info" :disabled="sendStatus === 'loading'" @click="getCode">{{ sendText }}</van-button>
              </template>
            </van-field>
            <van-field v-model="registerForm.password" type="password" clearable name="密码" placeholder="请输入" label="密码" :rules="[{ required: true, message: '请填写密码' }]" />
            <van-field v-model="registerForm.nickname" label="姓名" clearable placeholder="请输入" :rules="[{ required: true, message: '请填写姓名' }]" />
            <van-field name="radio" label="性别">
              <template #input>
                <van-radio-group v-model="registerForm.gender" direction="horizontal">
                  <van-radio name="1">男</van-radio>
                  <van-radio name="2">女</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field readonly clickable name="datetimePicker" :value="registerForm.birthday" label="生日" placeholder="点击选择时间" @click="showTimePicker = true" />
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
      </van-tab>
    </van-tabs>
    <div style="margin: 16px;">
      <van-button round block type="info">提交</van-button>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils/js-tools'

export default {
  data() {
    return {
      loginType: 'username',
      userForm: { mobile: '', password: '' },
      mobileForm: { mobile: '', code: '' },
      registerForm: { avatarUrl: '', code: '', gender: '1', mobile: '', nickname: '', password: '', birthday: '' },
      //验证码
      sendText: '发送验证码',
      sendStatus: 'free',
      sendTimer: null,
      remainingTime: 0,
      //日期选择器
      showTimePicker: false,
      minDate: new Date(1923, 1, 1),
      maxDate: new Date(2023, 1, 1),
      uploader: [{ url: 'https://img01.yzcdn.cn/vant/leaf.jpg' }]
    }
  },
  methods: {
    onSubmit(values) {
      console.log('submit', values)
    },
    getCode() {
      if (this.sendStatus === 'loading') {
        return
      }

      // 发送获取验证码的请求

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
    },
    onConfirm(time) {
      this.registerForm.birthday = parseTime(time, '{y}-{m}-{d}')
      this.showTimePicker = false
    },
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file)
    }
  }
}
</script>

<style lang="stylus" scoped>
.tab-bar {
  margin: 50px 0 70px 0
  .tabs {
    margin-top: 50px
  }
}
</style>
