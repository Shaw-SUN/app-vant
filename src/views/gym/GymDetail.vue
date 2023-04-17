<template>
  <div class="page-container">
    <van-nav-bar title="健身房详情" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-card :thumb="detail.logoUrl" class="card">
      <template #title>
        <div class="name">{{ detail.name }}</div>
      </template>
      <template #tags>
        <div>地址: {{ detail.address }}</div>
        <div>营业时间：{{ detail.time }}</div>
        <div>面积：{{ detail.area }}平方米</div>
      </template>
      <template #price>
        <van-tag color="#ebe6e6" text-color="#ff896b"><van-icon name="phone-o" />{{ detail.phone }}</van-tag>
      </template>
      <template #num>
        <span><van-icon name="star" color="#ee0a24" /> {{ detail.point }}</span>
      </template>
    </van-card>
    <van-tabs v-model="activeName" sticky>
      <van-tab title="详情" name="detail">
        <div class="detail">
          <div id="mapDiv" style="width: 300px; height: 150px; margin-bottom: 30px;"></div>
          <div class="content">详情：{{ detail.content }}</div>
          <van-image width="100" height="100" :src="detail.detailUrl" />
        </div>
      </van-tab>
      <van-tab title="商品" name="goods">
        <van-card v-for="(item, index) in detail.goodList" :key="index" :price="item.price.toFixed(2)" :thumb="item.logoUrl" class="card" @click="toGood(item.id)">
          <template #title>
            <div class="name">{{ item.name }}</div>
          </template>
          <template #desc>
            <span>剩余：{{ item.stock }} </span>
            <span>已售：{{ item.sale }}</span>
          </template>
          <template #tags>
            <div><van-icon name="fire-o" color="#ee0a24" />{{ item.frequency }}</div>
          </template>
          <template #num>
            <van-button size="mini" @click="toBuy(item.id)">购买</van-button>
          </template>
        </van-card>
      </van-tab>
      <van-tab title="评论" name="comments">
        <van-cell v-for="(item, index) in detail.commentList" :key="index" @click="toComment(item.id)">
          <template #title>
            <div class="content">{{ item.content }}</div>
            <div><van-image width="80" height="80" :src="item.picUrl" /></div>
          </template>
          <template #label>{{ parseTime(item.createdAt, '{y}-{m}-{d} {h}:{i}:{s}') }}</template>
          <template #default>
            <span><van-icon name="star" color="#ee0a24" /> {{ item.point }}</span>
          </template>
        </van-cell>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import AMapLoader from '@amap/amap-jsapi-loader'
import { parseTime, getTimestamp } from '@/utils/js-tools'
import { getGymDetail, buyGood } from '@/service/gym'
export default {
  data() {
    return {
      activeName: '',
      detail: {}
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    getDetail() {
      getGymDetail(this.$route.query.id).then((res) => {
        this.detail = res.data
        this.initMap()
      })
    },
    toBuy(id) {
      Dialog.confirm({
        message: '确认购买吗？'
      })
        .then(() => {
          buyGood(id).then(() => {
            this.$toast('购买成功')
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    toGood(id) {
      this.$router.push({
        path: '/gym/good',
        query: { id: id }
      })
    },
    toComment(id) {
      this.$router.push({
        path: '/gym/comment',
        query: { id: id }
      })
    },
    initMap() {
      const that = this
      AMapLoader.load({
        key: '3d34a78642a6d5fd2e80361e2d8b29e9', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [''] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          that.AMap = AMap
          this.drawMap()
        })
        .catch((e) => {
          console.log(e)
        })
    },
    drawMap() {
      var lat = this.detail.latitude
      var lng = this.detail.longitude
      this.map = new AMap.Map('mapDiv', {
        resizeEnable: true,
        center: [lng, lat], //地图中心点
        zoom: 18 //地图显示的缩放级别
      }) // 创建一个 Marker 实例：
      var marker = new AMap.Marker({
        position: new AMap.LngLat(lng, lat), // 经纬度对象
        title: '北京',
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png'
      })
      // 将创建的点标记添加到已有的地图实例：
      this.map.add(marker)
    }
  }
}
</script>

<style lang="stylus" scoped>
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
.detail {
  padding: 40px
  .content {
    margin-bottom: 30px
  }
}
.content {
    margin-bottom: 30px
  }
</style>
