import bindPhoneModel from './Index'
import Vue from 'vue'
/**
 * 引入router与主实例公用router
 */
import { router } from '@/plugins/vue-router'
/**
 * 引入router与主实例公用router
 */
let instance = null

let bindPhoneConstructor = Vue.extend(bindPhone)

function init(options = {}) {
  instance = new bindPhoneConstructor({router})
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
    vue.prototype.$BindPhoneDialog = caller
  }
}
