<template>
  <div class="page-container">
    <div class="bg-pic"><img src="@/assets/images/index.png" alt="" /></div>
    <div class="entrance">
      <div class="group">
        <div @click="toNote"><img src="@/assets/images/entrance-resident.png" alt="" /></div>
        <div @click="toVolunteer"><img src="@/assets/images/entrance-volunteer.png" alt="" /></div>
      </div>
      <div class="group">
        <div @click="toManager"><img src="@/assets/images/entrance-manage.png" alt="" /></div>
        <div @click="toRank"><img src="@/assets/images/entrance-rank.png" alt="" /></div>
      </div>
    </div>
    <!-- 登录弹窗 -->
    <van-dialog class="dialog" v-model="login.show" :showConfirmButton="false">
      <div class="dialog-content">
        <div class="dialog-title">账号登陆</div>
        <van-field v-model="login.mobile" type="tel" placeholder="请输入手机号" :border="false" class="dialog-input"></van-field>
        <van-field v-model="login.password" type="password" placeholder="请输入登录密码" :border="false" class="dialog-input"></van-field>
        <div class="code">
          <van-field v-model="login.code" placeholder="请输入验证码" :border="false" class="dialog-input code-input"></van-field>
          <div class="code-img" @click="getCodeImg"><img :src="'Data:image/jpg;base64,' + login.codeImg" alt="" /></div>
        </div>
        <div><van-button class="dialog-conform" @click="tologin">登录</van-button></div>
      </div>
      <div class="dialog-close" @click="closeLogin"><img src="@/assets/images/dialog-close.png" alt="" /></div>
    </van-dialog>
    <!-- 须知 -->
    <van-dialog class="dialog" v-model="note.show" :showConfirmButton="false">
      <div class="dialog-content">
        <div class="dialog-title">文明吹哨我来拍须知</div>
        <div class="note">这里是须知内容</div>
        <div class="btn-group">
          <van-button :disabled="note.disabled" @click="toResident">{{ note.buttonText }}</van-button>
          <van-button @click="cancelCount">取消</van-button>
        </div>
      </div>
      <div class="dialog-close" @click="cancelCount"><img src="@/assets/images/dialog-close.png" alt="" /></div>
    </van-dialog>
  </div>
</template>

<script>
import { getCaptcha, volunteerLogin } from '@/service/home/volunteer'
import { managerLogin } from '@/service/home/manager'
export default {
  data() {
    return {
      login: {
        show: false,
        mobile: '',
        password: '',
        code: '',
        uuid: '',
        encryptData: '',
        codeImg: '',
        goto: ''
      },
      note: {
        show: false,
        disabled: true,
        secondsRemaining: 5,
        intervalId: null,
        buttonText: '5秒后可同意'
      }
    }
  },
  methods: {
    //同意弹窗
    toNote() {
      this.note = {
        show: true,
        disabled: true,
        secondsRemaining: 5,
        intervalId: null,
        buttonText: '5秒后可同意'
      }
      this.countdown() // 开始倒计时
    },
    //同意计时
    countdown() {
      this.note.intervalId = setInterval(() => {
        if (this.note.secondsRemaining < 2) {
          this.note.disabled = false
          this.note.buttonText = '同意'
          clearInterval(this.note.intervalId)
        } else {
          this.note.secondsRemaining--
          this.note.buttonText = `${this.note.secondsRemaining}秒后可同意`
        }
      }, 1000)
    },
    // 不同意
    cancelCount() {
      this.note.show = false
      clearInterval(this.note.intervalId)
    },
    //居民入口
    toResident() {
      this.note = {
        show: false,
        disabled: true,
        secondsRemaining: 5,
        intervalId: null,
        buttonText: '5秒后可同意'
      }
      this.$router.push('/resident')
    },
    //登录
    tologin() {
      let params = {
        mobile: this.login.mobile,
        password: this.$md5(this.login.password),
        code: this.login.code,
        uuid: this.login.uuid,
        encryptData: this.login.encryptData
      }
      if (this.login.goto === 'volunteer') {
        volunteerLogin(params)
          .then((res) => {
            sessionStorage.setItem('Authorization', res.data.token)
            this.closeLogin()
            this.$router.push('/volunteer')
          })
          .catch(() => {
            this.getCodeImg()
          })
      } else if (this.login.goto === 'manager') {
        managerLogin(params)
          .then((res) => {
            sessionStorage.setItem('Authorization', res.data.token)
            this.closeLogin()
            this.$router.push('/manager')
          })
          .catch(() => {
            this.getCodeImg()
          })
      }
    },

    //获取验证码图片
    getCodeImg() {
      getCaptcha().then((res) => {
        this.login.uuid = res.data.uuid
        this.login.encryptData = res.data.encryptData
        this.login.codeImg = res.data.captchaData.captchaImg
      })
    },
    // 志愿者上报入口
    toVolunteer() {
      this.login.show = true
      this.login.goto = 'volunteer'
      this.getCodeImg()
      sessionStorage.removeItem('Authorization')
    },
    //工单处理入口
    toManager() {
      this.login.show = true
      this.login.goto = 'manager'
      this.getCodeImg()
      sessionStorage.removeItem('Authorization')
    },
    //积分排行
    toRank() {
      this.$router.push('/rank')
    },
    closeLogin() {
      this.login = {
        show: false,
        mobile: '',
        password: '',
        code: '',
        uuid: '',
        encryptData: '',
        codeImg: '',
        goto: ''
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.page-container {
  width: 100%
  height: 100%
  overflow-y: scroll
  font-family: PingFangSC-Regular, PingFang SC
  font-weight: 400
  position: relative
  background-color: #a5d1ff

  .bg-pic {
    img {
      display: block
      width: 100%
    }
  }

  .entrance {
    width: 100%
    position: absolute
    top: 1160px
    display: flex
    flex-direction: column
    align-items: center
    padding: 0 60px

    .group {
      margin-bottom: 45px
      width: 100%
      display: flex
      justify-content: space-around

      img {
        display: block
        width: 275px
      }
    }
  }

  .dialog {
    background-color: transparent

    /deep/ .van-dialog__content {
      display: flex
      flex-direction: column
      align-items: center

      .dialog-content {
        display: flex
        flex-direction: column
        align-items: center
        width: 520px
        height: 550px
        padding: 45px
        background-color: #FFFFFF
        border-radius: 20px

        .dialog-title {
          font-size: 43px
          font-family: PingFangSC-Medium, PingFang SC
          font-weight: 500
          color: #333333
          line-height: 60px
          margin-bottom: 25px
        }

        .dialog-input {
          display: flex
          align-items: center
          margin: 10px 0
          border-radius: 10px
          border: 1px solid #999999
          height: 65px
        }

        .code {
          display: flex

          .code-input {
            margin-right: 10px
            width: 245px
            height: 65px
          }

          .code-img {
            margin: 10px 0
            border-radius: 10px
            border: 1px solid #3986D5
            width: 180px
            height: 65px
            display: flex
            justify-content: center

            img {
              display: block
              width: 178px
              height: 63px
              border-radius: 9px
            }
          }
        }

        .dialog-conform {
          margin-top: 40px
          width: 225px
          height: 75px
          background: #3986D5
          border-radius: 17px
          font-size: 32px
          color: #FFFFFF
        }
      }

      .note {
        width: 100%
        height: 300px
      }

      .btn-group {
        width: 100%
        display: flex
        justify-content: space-around
        margin-top: 25px

        button {
          padding: 0
          display: block
          width: 200px
          height: 75px
          text-align: center
          border-radius: 17px
          background: #3986D5
          color: #FFFFFF
          font-size: 32px
        }
      }

      .dialog-close {
        margin-top: 55px
        width: 45px
        height: 45px

        img {
          width: 45px
          height: 45px
        }
      }
    }
  }
}
</style>
