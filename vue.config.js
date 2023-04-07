module.exports = {
  // transpileDependencies: ['vue-awesome-swiper', 'swiper', 'dom7', 'vue-signature-pad', 'signature_pad', 'merge-images'],
  publicPath: '/',
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true
      }
    }
  },
  devServer: {
    https: false,
    proxy: {
      '/api': {
        target: 'http://moonquakes.club:32093', //测试
        ws: false,
        changeOrigin: true
      },
    }
  },
  chainWebpack: (config) => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 移除 preload 插件
    config.plugins.delete('preload')
  }
}
