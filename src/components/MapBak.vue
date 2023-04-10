<template>
  <div class="box">
    <div id="container"></div>
    <!-- 侧边栏 -->
    <div class="sidebar" v-if="cateList.length > 0">
      <div class="bar-item" v-for="(item, index) in cateList" :key="item.id" @click="barClick(index)">
        <div class="bar-title" :class="{ 'is-selected': parseInt(index) === parseInt(categoryIndex) }">
          {{ item.title }}
        </div>
      </div>
    </div>
    <!-- 频道列表 -->
    <div class="channel-list" v-if="cateList.length > 0 && cateList[categoryIndex].child.length > 0">
      <div class="channel-item" :class="{ 'is-selected': parseInt(pointIndex) === parseInt(index) }" v-for="(item, index) in cateList[categoryIndex].child" :key="item.id" @click="channelClick(index)">
        <img class="icon" :src="item.icon" alt="" />
        <div class="desc">{{ item.title }}</div>
      </div>
    </div>
    <div class="bottom-info">
      <div class="current-out-box">
        <div class="current-box" @click="initOwnLocation(() => {})">
          <img class="current-location" src="@/assets/images/common/icon_location.png" alt="" />
        </div>
      </div>
      <div class="show-more-box" @click="showMore = !showMore" v-if="positionList.length != 0 || appList.length != 0">
        <div class="bar" v-if="!showMore"></div>
        <img class="bar-item" v-else src="@/assets/images/map/icon_show_more.png" alt="" />
      </div>
      <div class="detail-box" :class="{ 'app-box': active == 1 }" v-if="positionList.length != 0 || appList.length != 0">
        <van-tabs v-model="active" animated swipeable class="map-tab">
          <van-tab title="地图点位" v-if="positionList.length > 0">
            <!-- 折叠状态 -->
            <ul class="location-list" :class="{ 'show-more': showMore }">
              <template v-if="!showMore">
                <li class="location-item" v-for="item in positionList.slice(0, 1)" @click="focus(item.longitude, item.latitude)" :key="item.id">
                  <div class="one-line-info">
                    <span class="name">
                      {{ item.title }}
                    </span>
                    <span>
                      {{ item.distance | calcdistance }}
                    </span>
                  </div>
                  <div class="two-line-info">
                    <div class="text">{{ item.openTime }}</div>
                    <img @click="openMap(item)" src="@/assets/images/map/icon_open_location.png" alt="" />
                  </div>
                </li>
              </template>
              <!-- 展开状态 -->
              <template v-else>
                <li class="location-item" v-for="item in positionList" :key="item.id" @click="focus(item.longitude, item.latitude)">
                  <div class="one-line-info">
                    <span class="name">
                      {{ item.title }}
                    </span>
                    <span>
                      {{ item.distance | calcdistance }}
                    </span>
                  </div>
                  <div class="two-line-info">
                    <span>{{ item.openTime }}</span>
                    <img @click="openMap(item)" src="@/assets/images/map/icon_open_location.png" alt="" />
                  </div>
                  <div class="three-line-info">
                    <span>{{ item.tel }}</span>
                  </div>
                  <div class="four-line-info">
                    <span>{{ item.address }}</span>
                  </div>
                </li>
              </template>
            </ul>
          </van-tab>
          <van-tab title="相关应用" v-if="appList.length > 0">
            <div class="app-list" :class="{ 'show-more': showMore }">
              <div class="app-item" v-for="item in appList" :key="item.id" @click="toDetail(item.url)">
                <img class="icon" :src="item.icon" alt="" />
                <div class="desc">{{ item.title }}</div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { getMapCategoriesList, getMapPointsInfos } from '@/service/map/index'
import AMapLoader from '@amap/amap-jsapi-loader'
export default {
  name: 'service',
  data() {
    return {
      ownMarker: null,
      // 用户当前定位 默认定位 高新区政府
      longitude: 120.436429,
      latitude: 31.328944,
      roundImg: require('@/assets/images/map/round.png'),
      // 一级所选 index
      categoryIndex: 0,
      // 二级级所选 index
      pointIndex: 0,
      // 侧边栏选中id
      isSelected: '',
      // 二级分类id
      isSelectedChildId: '',
      active: 0,
      showMore: false,
      map: null,
      // 一级列表
      cateList: [
        // {
        //   id: 1,
        //   title: '宜居',
        //   isSelected: true
        // },
      ],
      AMap: null,
      // 点位列表
      positionList: [],
      // 点位标点列表
      markerList: [],
      // 应用列表
      appList: []
    }
  },
  filters: {
    calcdistance(val) {
      if (val > 0 && val < 1) {
        return parseInt(val * 1000) + 'm'
      } else {
        return val ? Number(val).toFixed(2) + 'km' : '0m'
      }
    }
  },
  mounted() {
    //DOM初始化完成进行地图初始化
    this.initMap()
  },
  methods: {
    // 获取全部分类
    initcategories() {
      getMapCategoriesList().then((res) => {
        this.cateList = [...res]
        if (this.cateList.length > 0 && this.cateList[0].child.length > 0) {
          this.initPointAndApp()
        }
      })
    },
    // 侧边栏点击
    barClick(index) {
      this.categoryIndex = index
      this.pointIndex = 0
      this.map.remove(this.markerList)
      this.initPointAndApp()
    },
    // 频道切换
    channelClick(index) {
      this.pointIndex = index
      // 切换前清除上次覆盖物
      this.map.remove(this.markerList)
      // 清空上次存储的数据
      this.positionList = []
      this.initPointAndApp()
    },
    // 初始化地图
    initMap() {
      const that = this
      AMapLoader.load({
        key: '296d877899f75935b8a2e0c721906f05', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [''] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          that.AMap = AMap
          that.initOwnLocation(that.initcategories)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 初始化自己定位
    initOwnLocation(cb = () => {}) {
      let that = this
      if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
        setTimeout(() => {
          window.wx.ready(() => {
            window.wx.getLocation({
              type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: function (res) {
                that.longitude = Number(res.longitude)
                that.latitude = Number(res.latitude)
                if (that.ownMarker) {
                  that.map.remove(that.ownMarker)
                }
                // 绘制当前自我定位点
                that.ownMarker = new that.AMap.Marker({
                  icon: that.roundImg,
                  position: [that.longitude, that.latitude]
                })
                if (that.map) {
                  that.focus(that.longitude, that.latitude)
                } else {
                  that.map = new that.AMap.Map('container', {
                    //设置地图容器id
                    viewMode: '3D', //是否为3D地图模式
                    zoom: 17, //初始化地图级别
                    center: [that.longitude, that.latitude] //初始化地图中心点位置
                  })
                }
                // 添加当前定位坐标点
                that.map.add(that.ownMarker)
                that.map.setFitView()
                cb()
              },
              fail: function () {
                that.longitude = 120.436429
                that.latitude = 31.328944
                if (that.ownMarker) {
                  that.map.remove(that.ownMarker)
                }
                // that.$toast('获取定位失败,使用默认定位')
                // 绘制当前自我定位点
                that.ownMarker = new that.AMap.Marker({
                  icon: that.roundImg,
                  position: [that.longitude, that.latitude]
                })
                if (that.map) {
                  that.focus(that.longitude, that.latitude)
                } else {
                  that.map = new that.AMap.Map('container', {
                    //设置地图容器id
                    viewMode: '3D', //是否为3D地图模式
                    zoom: 17, //初始化地图级别
                    center: [that.longitude, that.latitude] //初始化地图中心点位置
                  })
                }
                // 添加当前定位坐标点
                that.map.add(that.ownMarker)
                that.map.setFitView()
                cb()
              }
            })
          })
        }, 750)
      } else {
        that.initWebOwnLocation(cb)
      }
    },
    initWebOwnLocation(cb = () => {}) {
      let that = this
      // 获取当前定位点
      this.AMap.plugin('AMap.Geolocation', function () {
        var geolocation = new that.AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量
          offset: [0, 0],
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          position: 'RB'
        })
        geolocation.getCurrentPosition(function (status, result) {
          if (status == 'complete') {
            onComplete(result)
          } else {
            onError(result)
          }
        })
        function onComplete(data) {
          // data是具体的定位信息
          console.log('成功data', data, data.position.lat, data.position.lng)
          that.longitude = data.position.lng.toString()
          that.latitude = data.position.lat.toString()
          cb()
          that.ownMarker = new that.AMap.Marker({
            icon: that.roundImg,
            position: [that.longitude, that.latitude]
          })
          if (that.map) {
            that.focus(that.longitude, that.latitude)
          } else {
            that.map = new that.AMap.Map('container', {
              //设置地图容器id
              viewMode: '3D', //是否为3D地图模式
              zoom: 17, //初始化地图级别
              center: [that.longitude, that.latitude] //初始化地图中心点位置
            })
          }
          // 添加当前定位坐标点
          that.map.add(that.ownMarker)
        }
        function onError(data) {
          // 定位出错
          console.log('错误data', data)
          cb()
          that.ownMarker = new that.AMap.Marker({
            icon: that.roundImg,
            position: [that.longitude, that.latitude]
          })
          if (that.map) {
            that.focus(that.longitude, that.latitude)
          } else {
            that.map = new that.AMap.Map('container', {
              //设置地图容器id
              viewMode: '3D', //是否为3D地图模式
              zoom: 17, //初始化地图级别
              center: [that.longitude, that.latitude] //初始化地图中心点位置
            })
          }
        }
      })
    },
    // 初始化点位 、应用
    initPointAndApp() {
      console.log('初始化点位和应用')
      let that = this
      // 清空点位
      this.positionList = []
      // 清空应用
      this.appList = []

      let category_id = this.cateList[this.categoryIndex].id
      if (this.cateList[this.categoryIndex].child.length == 0) {
        // 无二级频道不请求 数据
        return
      }
      let point_id = this.cateList[this.categoryIndex].child[this.pointIndex].id
      let params = {
        category_id,
        point_id
      }
      // 获取点位初始化
      getMapPointsInfos(params.category_id, params.point_id, that.longitude, that.latitude, 1)
        .then((res) => {
          console.log('点位', res)
          this.positionList = res.list || []
          this.drawMarker()
        })
        .catch(() => {
          console.log('获取点位初始化失败')
        })
      // 获取应用
      getMapPointsInfos(params.category_id, params.point_id, '', '', 2)
        .then((res) => {
          console.log('应用', res)
          this.appList = res.list || []
        })
        .catch(() => {
          console.log('获取应用初始化失败')
        })
    },
    // 画标志点
    drawMarker() {
      let that = this
      // 切换添加覆盖物
      this.markerList = []
      this.positionList.forEach((v) => {
        if (v.pointIsShowIcon == 1) {
          let icon = new that.AMap.Icon({
            size: new that.AMap.Size(20, 20), // 图标尺寸
            image: v.pointIcon, // Icon的图像
            imageSize: new that.AMap.Size(20, 20) // 根据所设置的大小拉伸或压缩图片
          })
          let marker = new that.AMap.Marker({
            icon: icon,
            position: new that.AMap.LngLat(v.longitude, v.latitude),
            offset: new that.AMap.Pixel(-10, -10)
          })
          this.markerList.push(marker)
        }
      })
      this.map.add(this.markerList)
      this.map.setFitView()
    },
    // 应用跳转
    toDetail(url) {
      if (url.indexOf('http') != -1) {
        location.href = url
      }
    },
    // 地图聚焦到坐标
    focus(lng, lat) {
      this.map.setZoomAndCenter(19, [Number(lng), Number(lat)])
    },
    // 打开地图
    openMap(item) {
      window.wx.openLocation({
        latitude: Number(item.latitude), // 纬度，浮点数，范围为90 ~ -90
        longitude: Number(item.longitude), // 经度，浮点数，范围为180 ~ -180。
        name: item.title, // 位置名
        address: item.address, // 地址详情说明
        scale: 19, // 地图缩放级别,整型值,范围从1~28。默认为最大
        infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.box{
  width: 100%
  flex:1;
  display: flex;
  flex-direction: column;
  position:relative;
  #container{
    padding:0px;
    margin: 0px;
    width: 100%;
    height: 100%;
  }
  .sidebar{
    border-radius: 8px;
    background: #FFFFFF;
    width: 96px;
    max-height:350px;
    align-items: center;
    overflow-x:hidden
    overflow-y:scroll
    position:absolute;
    top:18px
    left:30px;
    .bar-item{
      // height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      position:relative;
      padding:12px 0
      &:not(:last-child)::after{
        content:'';
        display: flex;
        width: 60px;
        height: 1px;
        background: #EEEEEE;
        position:absolute;
        bottom:0;

      }
      .bar-title{
        width: 78px;
        border-radius: 8px;
        color: #1A1A1A;
        font-size: 28px;
        display: flex;
        align-items: center;
        justify-content: center
        padding: 0 10px;
        &.is-selected{
          color: #FFFFFF;
          opacity: 0.3;
          border-radius: 8px;
          background: #2F6CF5;
        }
      }
    }
  }
  .channel-list{
    position:absolute
    top:18px;
    right:30px;
    width: 580px;
    max-height: 325px;
    background: #FFFFFF;
    box-shadow: 0px 5px 20px 0px rgba(85, 85, 85, 0.2);
    border-radius: 8px;
    overflow-x hidden
    overflow-y scroll;
    display: flex;
    flex-wrap: wrap;
    padding:15px 0 0 0;
    .channel-item{
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow hidden;
      width:33.3333%;
      padding-bottom: 15px;
      &.is-selected{
        .desc{
          color: #2F6CF5;
        }
      }
      .icon{
        width: 50px;
        height: 50px;
        margin-bottom: 14px;
      }
      .desc{
        width: 140px;
        height:76px;
        font-size: 28px;
        color: #1A1A1A;
        line-height: 38px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
        -webkit-line-clamp: 2; /* 控制最多显示几行 */
        -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
        text-align: center
      }
    }
  }
  .bottom-info{
    position:absolute;
    right:0;
    bottom:14px;
    left:0;
    display: flex;
    flex-direction: column;
    align-items: center;
    .current-out-box{
      width:100%;
      display:flex;
      flex-direction: row-reverse;
      padding:0 30px;
      .current-box{
        width: 80px;
        height: 80px;
        background: #FFFFFF;
        box-shadow: 0px 5px 20px 0px rgba(85, 85, 85, 0.2);
        border-radius: 8px;
        display:flex;
        align-items: center;
        justify-content: center;
        .current-location{
          width: 50px;
          height: 50px;
        }
      }
    }
    .show-more-box{
      height:40px;
      display: flex;
      align-items: center;
      justify-content: center;
      .bar{
        width: 62px;
        height: 8px;
        background: #729BF8;
        border-radius: 4px;
        margin-bottom:15px;
      }
      .bar-item{
        margin-bottom:15px;
        width: 62px;
      }
    }
    .detail-box{
      width: 690px;
      min-height: 200px;
      max-height: max-content;
      overflow: hidden
      background: #FFFFFF;
      box-shadow: 0px 5px 20px 0px rgba(85, 85, 85, 0.2);
      border-radius: 8px;
      &.more-height{
        transition: all 2s
        max-height: 9999px;
      }
      &.app-box{
        min-height:265px;
      }
      .app-list{
        width: 100%;
        max-height: 200px;
        background: #FFFFFF;
        box-shadow: 0px 5px 20px 0px rgba(85, 85, 85, 0.2);
        border-radius: 8px;
        overflow-x hidden
        overflow-y hidden;
        display: flex;
        flex-wrap: wrap;
        padding:30px 40px 0 40px;
        transition: all 1s
        &.show-more{
          overflow-y:scroll;
          max-height:350px;
        }
        .app-item{
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          overflow hidden;
          width:33.3333%;
          padding-bottom: 30px;
          &.is-selected{
            .desc{
              color: #2F6CF5;
            }
          }
          .icon{
            width: 50px;
            height: 50px;
            margin-bottom: 14px;
          }
          .desc{
            width: 138px;
            height:76px;
            font-size: 28px;
            color: #1A1A1A;
            line-height: 38px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
            -webkit-line-clamp: 2; /* 控制最多显示几行 */
            -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
            text-align: center
          }
        }
      }
      .location-list{
        padding:0 30px;
        max-height:130px;
        overflow-x hidden
        overflow-y hidden
        transition: all 1s
        &.show-more{
          max-height:500px;
          overflow-x hidden
          overflow-y scroll
        }
        .location-item{
          border-top:1px solid #eeeeee
          padding:20px 0;
          .one-line-info{
            display: flex;
            justify-content: space-between
            align-items: baseline
            color: #ACACAC;
            font-size: 28px;
            margin-bottom: 16px;
            .name{
              font-weight: bolder;
              color: #1A1A1A;
              font-size: 32px;
              white-space:nowrap;/* 规定文本是否折行 */
              overflow: hidden;/* 规定超出内容宽度的元素隐藏 */
              text-overflow: ellipsis;
            }
          }
          .two-line-info{
            display: flex;
            justify-content: space-between
            align-items: center;
            font-size: 24px;
            color: #666666;
            .text{
              white-space:nowrap;/* 规定文本是否折行 */
              overflow: hidden;/* 规定超出内容宽度的元素隐藏 */
              text-overflow: ellipsis;
            }
            img{
              width: 34px;
              height: 34px;
            }
          }
          .three-line-info{
            font-size: 24px;
            color: #666666;
          }
          .four-line-info{
            font-size: 24px;
            color: #666666;
          }
        }
      }
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
</style>
