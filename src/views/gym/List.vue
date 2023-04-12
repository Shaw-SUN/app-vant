<template>
  <div class="page-container">
    <van-search v-model="params.name" placeholder="搜索" shape="round"></van-search>
    <van-cell title="当前定位" icon="location-o" center class="location" />
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" class="list">
        <van-card v-for="item in list" :key="item" desc="地址" thumb="https://img01.yzcdn.cn/vant/ipad.jpeg" class="card">
          <template #title>
            <div class="name">名称</div>
          </template>
          <template #tags>
            <van-tag color="#e9fadd" text-color="#b8e4c9" class="tag"><van-icon name="clock-o" />12:00-1:00</van-tag>
            <van-tag color="#ebe6e6" text-color="#ff896b"><van-icon name="phone-o" />178777777</van-tag>
          </template>
          <template #num>
            <div><van-icon name="location-o" />距离2km</div>
          </template>
        </van-card>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getGymList } from '@/service/gym'
export default {
  data() {
    return {
      params: {
        longitude: 0,
        latitude: 0,
        name: '',
        distance: '',
        state: '1'
      },
      //列表
      list: [],
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  mounted() {
    this.getLocation()
  },
  methods: {
    getList() {
      getGymList(this.params).then((res) => {
        this.list = res.data
      })
    },
    /**获取地图定位*/
    getLocation() {
      let that = this
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            that.params.longitude = position.coords.longitude
            that.params.latitude = position.coords.latitude
            that.getList()
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
