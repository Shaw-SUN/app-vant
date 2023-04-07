/* eslint-disable */
// 是否微信
export function is_weixin() {
  var ua = navigator.userAgent
  var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
    isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
    isAndroid = ua.match(/(Android)\s+([\d.]+)/),
    isMobile = isIphone || isAndroid
  if (isMobile) {
    if (ua.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

// 字符串转十六进制
export function strToHexCharCode(str) {
  if (str === '') return ''
  var hexCharCode = []
  for (var i = 0; i < str.length; i++) {
    hexCharCode.push(str.charCodeAt(i).toString(16))
  }
  return hexCharCode.join('')
}

/**
 * 字符串脱敏
 * @param {*} str 字符串
 * @param {*} beginLen 符串前面保留位数
 * @param {*} endLen 字符串后面保留位数
 * @returns string
 */
 export function desensitization(str, beginLen, endLen){
  beginLen = beginLen ? beginLen : 1
  endLen = endLen ? endLen : 1
  var len = str.length - beginLen - endLen;
  var xing ='';
  for (var i = 0; i < len; i++) {
      xing +='*';
  }
  return str.substring(0, beginLen) + xing + str.substring(str.length - endLen);
}
