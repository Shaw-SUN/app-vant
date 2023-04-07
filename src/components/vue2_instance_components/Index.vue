<template>
  <div class="mask">
    <div class="content">内容</div>
  </div>
</template>

<script>
export default {
  name: "bindPhone",
  data() {
    return {
      resolve: null,
      reject: null,
    };
  },
  watch: {
    $route: {
      handler: function (to) {
        // console.log(to, 'to')
        // console.log(this.$route, 'this.$route')
        if (to && to.path != this.$route && this.$route.path) {
          this.hide();
        }
      },
      immediate: true,
    },
  },
  methods: {
    show(cb) {
      typeof cb === "function" && cb.call(this, this);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    confirm() {
      this.resolve();
    },
    cancel() {
      this.reject("cancel");
      this.hide();
    },
    hide() {
      if (this.$el) {
        document.body.removeChild(this.$el);
        this.$destroy();
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.mask{
  position:fixed;
  top:0;
  right:0;
  bottom:0;
  left:0;
  display: flex;
  align-content: center;
  justify-items: center;
  background:rgba(0,0,0,0.3)；
  .content{
    border-radius:5px;
    background:#ffffff;
  }
}
</style>
