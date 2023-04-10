<template>
  <div class="page-container">
    <van-search v-model="keyWord" placeholder="请输入搜索关键词" show-action shape="round" class="search">
      <template #action>
        <span @click="onSearch" class="action">搜索</span>
        <span @click="onSearch" class="action">地图</span>
      </template>
    </van-search>
    <van-cell title="当前定位" icon="location-o" center class="location" />
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-card v-for="item in list" :key="item" num="2" price="2.00" desc="描述信息" title="商品标题" thumb="https://img01.yzcdn.cn/vant/ipad.jpeg" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyWord: '',
      //列表
      list: [],
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  methods: {
    onLoad() {
      setTimeout(() => {
        if (this.refreshing) {
          this.list = []
          this.refreshing = false
        }

        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        this.loading = false

        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 1000)
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    }
  }
}
</script>

<style lang="stylus" scoped>
.search {
  display:flex
  .action {
    flex-shrink 0
    margin-right 15px
  }
}
.location {
  padding 0 30px 15px 30px
}
</style>
