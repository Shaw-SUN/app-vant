import Vue from 'vue'
import App from './App.vue'
import { router } from '@/plugins/router/index'
import '@/utils/axios'
import '@/utils/lodash'
import '@/assets/css/common.styl'
import '@/utils/js-md5'
import { parseTime } from '@/utils/js-tools'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import MapLayer from '@/components/MapLayer'

import {
  Slider,
  Toast,
  Empty,
  Lazyload,
  Icon,
  Image as VanImage,
  Tabbar,
  TabbarItem,
  Tab,
  Tabs,
  Swipe,
  SwipeItem,
  PullRefresh,
  List,
  Uploader,
  Dialog,
  Loading,
  SidebarItem,
  Sidebar,
  Form,
  Field,
  Picker,
  Popup,
  CellGroup,
  Cell,
  Button,
  DatetimePicker,
  Cascader,
  ImagePreview,
  RadioGroup,
  Radio,
  Search,
  Card,
  Tag,
  NavBar,
  Rate,
  DropdownMenu,
  DropdownItem
} from 'vant'

Vue.use(Toast)
Vue.use(Empty)
Vue.use(Loading)
Vue.use(Icon)
Vue.use(VanImage)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Sidebar)
Vue.use(SidebarItem)
Vue.use(Swipe)
Vue.use(Slider)
Vue.use(SwipeItem)
Vue.use(PullRefresh)
Vue.use(List)
Vue.use(Uploader)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(Field)
Vue.use(Picker)
Vue.use(Popup)
Vue.use(CellGroup)
Vue.use(Cell)
Vue.use(Button)
Vue.use(DatetimePicker)
Vue.use(Cascader)
Vue.use(ImagePreview)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Search)
Vue.use(Card)
Vue.use(Tag)
Vue.use(NavBar)
Vue.use(Rate)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)

import VueTouch from 'vue-touch'
Vue.use(VueTouch, { name: 'v-touch' })
Vue.use(VueAwesomeSwiper)

Vue.use(MapLayer)
Vue.prototype.parseTime = parseTime
Vue.use(Lazyload, {
  lazyComponent: true,
  error: ''
})

//Vue.config.ignoredElements = ['wx-open-launch-weapp']

Vue.config.productionTip = false
new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
