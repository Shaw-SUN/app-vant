import mapLayerModel from './Index.vue'
import Vue from 'vue'
/**
 * 引入router与主实例公用router
 */
import { router } from '@/plugins/router/index'
/**
 * 引入router与主实例公用router
 */
let instance = null

let mapLayerConstructor = Vue.extend(mapLayerModel)

function init(options = {}) {
  instance = new mapLayerConstructor({ router })
  Object.assign(instance, options)
  document.body.appendChild(instance.$mount().$el)
}

function caller(options) {
  if (!instance) {
    init(options)
  }
  return instance.show(() => {
    instance = null
  })
}

export default {
  install(vue) {
    vue.prototype.$mapLayer = caller
  }
}
