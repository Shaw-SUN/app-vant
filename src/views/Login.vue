<template>
  <div class="page-container">
    <van-tabs v-model="loginType" background="transparent" class="tab-bar" color="#4f81c7">
      <van-tab title="密码登录" name="password" class="tabs">
        <van-cell-group inset>
          <van-form>
            <van-field v-model="userForm.mobile" label="手机号" clearable type="tel" placeholder="请输入" :rules="[{ pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '请填写正确的手机号' }]" />
            <van-field v-model="userForm.password" type="password" clearable name="密码" placeholder="请输入" label="密码" :rules="[{ required: true, message: '请填写密码' }]" />
          </van-form>
        </van-cell-group>
      </van-tab>
      <van-tab title="短信登录" name="phone" class="tabs">
        <van-cell-group inset>
          <van-form>
            <van-field v-model="mobileForm.mobile" label="手机号" clearable type="tel" placeholder="请输入" :rules="[{ pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '请填写正确的手机号' }]" />
            <van-field v-model="mobileForm.code" center clearable label="短信验证码" placeholder="请输入" :rules="[{ required: true, message: '请填写验证码' }]">
              <template #button>
                <van-button size="small" round plain type="info" :disabled="sendStatus === 'loading'" @click="getCode(mobileForm.mobile)">{{ sendText }}</van-button>
              </template>
            </van-field>
          </van-form>
        </van-cell-group>
      </van-tab>
      <van-tab title="注册" name="register" class="tabs">
        <van-cell-group inset>
          <van-form>
            <van-field v-model="registerForm.mobile" label="手机号" clearable type="tel" placeholder="请输入" :rules="[{ pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '请填写正确的手机号' }]" />
            <van-field v-model="registerForm.code" center clearable label="短信验证码" placeholder="请输入" :rules="[{ required: true, message: '请填写验证码' }]">
              <template #button>
                <van-button size="small" round plain type="info" :disabled="sendStatus === 'loading'" @click="getCode(registerForm.mobile)">{{ sendText }}</van-button>
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
            <van-field readonly clickable name="datetimePicker" :value="registerForm.birthday" label="生日" placeholder="点击选择时间" @click="showTimePicker = true" :rules="[{ required: true, message: '请填写生日' }]" />
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
      <van-button round block type="info" @click="onSubmit">提交</van-button>
    </div>
  </div>
</template>

<script>
import { parseTime, getTimestamp } from '@/utils/js-tools'
import { getCaptcha, passWordLogin, mobileLogin, register } from '@/service/user'
import { uploadFile } from '@/service/upload'
import { setToken } from '@/utils/auth'
export default {
  data() {
    return {
      loginType: 'password',
      userForm: { mobile: '', password: '' },
      mobileForm: { mobile: '', code: '' },
      registerForm: { mobile: '', code: '', password: '', nickname: '', gender: '1', avatarUrl: '', birthday: '' },
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
  methods: {
    onSubmit() {
      if (this.loginType === 'password') {
        this.userForm.password = this.$md5(this.userForm.password)
        passWordLogin(this.userForm).then((res) => {
          setToken(res.data.token)
          this.$router.push('/gym/list')
        })
      } else if (this.loginType === 'phone') {
        mobileLogin(this.mobileForm).then((res) => {
          setToken(res.data.token)
          this.$router.push('/gym/list')
        })
      } else if (this.loginType === 'register') {
        if (this.registerForm.avatarUrl) {
          this.registerForm.password = this.$md5(this.registerForm.password)
          this.registerForm.birthday = getTimestamp(this.registerForm.birthday, 10)
          register(this.registerForm).then((res) => {
            setToken(res.data.token)
            this.$router.push('/gym/list')
          })
        } else {
          this.$toast('请输入上传头像')
        }
      }
    },
    getCode(mobileNumber) {
      if (this.sendStatus === 'loading') {
        return
      }
      // 发送获取验证码的请求
      if (mobileNumber) {
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
      this.registerForm.birthday = parseTime(time, '{y}-{m}-{d}')
      this.showTimePicker = false
    },

    afterRead(file) {
      //console.log(file)
      let formData = new FormData()
      formData.append('file', file.file)
      uploadFile(formData).then((res) => {
        this.registerForm.avatarUrl = res.url
      })
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
