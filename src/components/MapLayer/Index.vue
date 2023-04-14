<template>
  <div class="mask">
    <div id="container"></div>
    <div class="location-info">
      <img src="@/assets/images/map/icon_location.png" class="location-icon" alt="" />
      <div class="info">
        <div class="name">{{ name }}</div>
        <div class="location">{{ location }}</div>
      </div>
      <div class="btn" @click="submitLocation">
        确定
      </div>
    </div>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'

export default {
  name: 'bindPhone',
  data() {
    return {
      resolve: null,
      reject: null,
      name: '常熟市政府',
      location: '苏州市常熟市金沙江路8号',
      map: null,
      AMap: null,
      // 用户当前定位 默认定位 高新区政府
      longitude: 120.752512,
      latitude: 31.656016,
      icon: null,
      png: require('@/assets/images/map/map_icon_location.png')
    }
  },
  mounted() {
    this.initMap()
  },
  watch: {
    $route: {
      handler: function (to) {
        // console.log(to, 'to')
        // console.log(this.$route, 'this.$route')
        if (to && to.path != this.$route && this.$route.path) {
          this.hide()
        }
      },
      immediate: true
    }
  },
  methods: {
    // 初始化地图
    initMap() {
      const that = this
      AMapLoader.load({
        key: 'cf91d9b650ad38fe050309055fdb2d20', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [''] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          that.AMap = AMap
          that.map = new AMap.Map('container', {
            //设置地图容器id
            viewMode: '3D', //是否为3D地图模式
            zoom: 17, //初始化地图级别
            center: [that.longitude, that.latitude] //初始化地图中心点位置
          })
          that.map.on('click', function (ev) {
            that.latitude = ev.lnglat.lat
            that.longitude = ev.lnglat.lng
            that.drawMap()
            that.getAddress()
          })
          that.icon = new AMap.Icon({
            // 图标的取图地址
            image: that.png,
            imageSize: new that.AMap.Size(21, 24.5) //根据所设置的大小拉伸或压缩图片
          })
          that.drawMap()
        })
        .catch((e) => {
          console.log(e)
        })
    },
    clearMap() {
      this.map.clearMap()
    },
    drawMap() {
      const { map, icon, longitude, latitude, AMap } = this
      this.clearMap()
      let marker = new AMap.Marker({
        icon: icon,
        position: new AMap.LngLat(longitude, latitude),
        offset: new AMap.Pixel(-10.5, -24)
      })
      map.add(marker)
    },
    show(cb) {
      typeof cb === 'function' && cb.call(this, this)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    confirm() {
      this.resolve()
    },
    cancel() {
      this.reject('cancel')
      this.hide()
    },
    hide() {
      if (this.$el) {
        document.body.removeChild(this.$el)
        this.$destroy()
      }
    },
    submitLocation() {
      const { name, location, longitude, latitude } = this
      this.resolve({ name, location, longitude, latitude })
      this.hide()
    },
    // 经纬度反解 地址
    getAddress() {
      const that = this
      const { AMap, latitude: lat, longitude: lng } = that
      AMap.plugin('AMap.Geocoder', function () {
        var geocoder = new AMap.Geocoder({
          // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
          city: '常熟'
        })
        var lnglat = [Number(lng), Number(lat)]
        geocoder.getAddress(lnglat, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            // result为对应的地理位置详细信息
            const {
              formattedAddress,
              addressComponent: { province, city, district, township, neighborhood, street, streetNumber }
            } = result.regeocode
            that.name = formattedAddress
            that.location = province + city + district + township + neighborhood + street + streetNumber
            that.drawInfoWindow()
          }
        })
      })
    },
    drawInfoWindow() {
      // 创建 infoWindow 实例
      const that = this
      const { map, AMap, latitude: lat, longitude: lng, name, location } = that
      // 移除所有窗体
      let infowin = map.getAllOverlays('InfoWindow')
      map.remove(infowin)
      // 创建新的窗体并添加
      let infoWindow = new AMap.InfoWindow({
        isCustom: true, //使用自定义窗体
        content: `<div class="info-win">
          ${name}
          </div>`, //传入 dom 对象，或者 html 字符串
        offset: new AMap.Pixel(0, -30)
      })
      infoWindow.open(map, [Number(lng), Number(lat)])
    }
  }
}
</script>

<style lang="stylus" scoped>
.mask{
  position:fixed;
  top:0;
  right:0;
  bottom:0;
  left:0;
  background:#ffffff;
  #container{
    padding:0px;
    margin: 0px;
    width: 100%;
    height: 100%;
  }
  .location-info{
    margin-bottom:100px 
    position:absolute;
    right:0;
    bottom:0;
    left:0;
    background:#ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:40px 35px
    .location-icon{
      width:52px;
      height:61px;
    }
    .info{
      flex:1;
      padding:0 23px;
      .name{
        font-size: 34px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 48px;
      }
      .location{
        font-size: 30px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 42px;
      }
    }
    .btn{
      width: 157px;
      height: 55px;
      background: #3986D5;
      border-radius: 10px;
      color:#ffffff
      font-size: 26px;
      display: flex;
      align-items: center;
      justify-content: center
    }
  }
}
</style>

<style lang="stylus">
.amap-logo,
.amap-copyright {
  display: none !important;
}
.map-tab{

  .van-tabs__line{
    width: 32px;
    height: 4px;
    background: #2F6CF5!important
    border-radius: 2px;
  }
  .van-tab--active{
    color: #1A1A1A;
    font-weight: bolder;
    font-size: 34px;
    .van-tab__text{
      font-weight: bolder;
      font-size: 34px;
    }
  }
}
.info-win{
  padding:5px 35px;
  background: #FFFFFF;
  box-shadow: 0px 2px 4px 0px rgba(57,134,213,0.47);
  border-radius: 10px;
  font-size: 27px;
  color: #3986D5;
  line-height: 38px;
}
</style>
