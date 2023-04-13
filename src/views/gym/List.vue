<template>
  <div class="page-container">
    <van-search v-model="params.name" placeholder="搜索" shape="round" @search="getList"></van-search>
    <van-cell v-if="params.longitude == 0" title="未获取到当前定位" icon="location-o" center value="重新获取" is-link @click="getLocation" class="location" />
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="getLocation" class="list">
        <van-dropdown-menu>
          <van-dropdown-item v-model="params.state" :options="option1" @change="getList" />
          <van-dropdown-item v-model="params.distance" :options="option2" @change="getList" />
        </van-dropdown-menu>
        <van-card v-for="(item, index) in list" :key="index" :desc="item.address" :thumb="item.logoUrl" class="card" @click="toDetail(item.id)">
          <template #title>
            <div class="name">{{ item.name }}</div>
          </template>
          <template #tags>
             <van-tag color="#e9fadd" text-color="#b8e4c9" class="tag"><van-icon name="expand-o" />{{ item.area }}平方米</van-tag>
            <van-tag color="#ebe6e6" text-color="#ff896b"><van-icon name="phone-o" />{{ item.phone }}</van-tag>
          </template>
          <template #num>
            <div><van-icon name="location-o" />距离{{ item.distanceStr }}</div>
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
      option1: [
        { text: '综合排序', value: '1' },
        { text: '距离最近', value: '2' }
      ],
      option2: [
        { text: '默认距离', value: '' },
        { text: '1km', value: '1' },
        { text: '3km', value: '3' },
        { text: '5km', value: '5' },
        { text: '10km', value: '10' }
      ],
      //列表
      list: [],
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  mounted() {
    //this.getLocation()
  },
  methods: {
    getList() {
      if (this.refreshing) {
        this.list = []
        this.refreshing = false
      }
      getGymList(this.params).then((res) => {
        this.list = res.data
        // 加载状态结束
        this.loading = false
        this.finished = true
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
    onRefresh() {
      // 清空列表数据
      this.finished = false
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.getList()
    },
    toDetail(id){
      this.$router.push({
        path: '/gym/detail',
        query: { id: id }
      })
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
}
</style>
