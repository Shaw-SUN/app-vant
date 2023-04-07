const path = require('path')
module.exports = ({ file }) => {
  const designWidth = file.dirname.includes(path.join('node_modules', 'vant')) ? 375 : 750
  return {
    plugins: {
      // "postcss-import": {},
      // "postcss-url": {},
      // "postcss-aspect-ratio-mini": {},
      'postcss-write-svg': {
        utf8: false
      },
      // "postcss-cssnext": {},
      'postcss-px-to-viewport': {
        unitToConvert: 'px',
        mediaQuery: true,
        viewportWidth: designWidth // (Number) The width of the viewport.
      },
      'postcss-viewport-units': {
        filterRule: (rule) => rule.selector.includes('::after') && rule.selector.includes('::before') && rule.selector.includes(':after') && rule.selector.includes(':before')
      },
      cssnano: {
        // preset: "advanced",
        autoprefixer: true
        // "postcss-zindex": false
      }
    }
  }
}
