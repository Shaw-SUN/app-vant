'use strict'
import sha256 from 'js-sha256'

function getSignature(_length) {
  var length = ''

  if (!_length) {
    length = 6
  } else {
    length = _length
  }

  var scope = 'request'
  var nonce = ''
  var strPol = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz'
  var timestamp = Math.ceil(Date.now() / 1000)
  var max = strPol.length - 1

  for (var i = 0; i < length; i += 1) {
    nonce += strPol[Math.ceil(Math.random() * max)]
  }

  var params = {
    nonce: nonce,
    timestamp: timestamp,
    scope: scope
  }
  var keys = Object.keys(params).sort()
  var arg_arr = []
  keys.forEach(function (key) {
    if (['signature'].indexOf(key) === -1) {
      arg_arr.push(''.concat(key, '=').concat(params[key]))
    }
  })
  var arg_str = arg_arr.join('&')
  var signature = sha256(arg_str)
  return {
    scope: scope,
    nonce: nonce,
    timestamp: timestamp,
    signature: signature
  }
}

export default getSignature
