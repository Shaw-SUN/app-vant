module.exports = {
  // transpileDependencies: ['vue-awesome-swiper', 'swiper', 'dom7', 'vue-signature-pad', 'signature_pad', 'merge-images'],
  publicPath: '/app/',
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
        target: 'https://moonquakes.club', //测试
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
