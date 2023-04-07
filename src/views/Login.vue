<template>
  <div class="page-container">
    <van-tabs v-model="loginType" background="transparent" class="tab-bar">
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
          <van-field v-model="mobileForm.mobile" label="手机号" clearable type="tel" placeholder="请输入" :rules="[{ required: true, message: '请填写正确的手机号' }]" />
          <van-field v-model="mobileForm.code" center clearable label="短信验证码" placeholder="请输入">
            <template #button>
              <van-button size="small" round plain type="info" :disabled="status === 'loading'" @click="getCode">{{ buttonText }}</van-button>
            </template>
          </van-field>
        </van-cell-group>
      </van-tab>
      <van-tab title="注册" name="register" class="tabs">内容 3</van-tab>
    </van-tabs>
    <div style="margin: 16px;">
      <van-button round block type="info">提交</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginType: 'username',
      userForm: { mobile: '', password: '' },
      mobileForm: { mobile: '', code: '' },
      buttonText: '发送验证码',
      status: 'idle',
      timer: null,
      remainingTime: 0,
    }
  },
  methods: {
    onSubmit(values) {
      console.log('submit', values)
    },
    getCode() {
      if (this.status === 'loading') {
        return;
      }

      // 发送获取验证码的请求

      // 更新按钮状态
      this.status = 'loading';
      this.buttonText = '发送中...';

      // 设置倒计时
      this.remainingTime = 60;
      this.timer = setInterval(() => {
        if (this.remainingTime === 0) {
          clearInterval(this.timer);
          this.timer = null;
          this.buttonText = '获取验证码';
          this.status = 'idle';
        } else {
          this.remainingTime--;
          this.buttonText = `${this.remainingTime} 秒后重试`;
        }
      }, 1000);
    },
  }
}
</script>

<style lang="stylus" scoped>
.page-container {
  width: 100%
  height: 100%
  overflow-y: scroll;
  background-color #fafafa
  .tab-bar {
    margin: 50px 0 70px 0
    .tabs {
      margin-top: 50px
    }
  }
}
</style>
