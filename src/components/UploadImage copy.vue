<template>
  <div class="upload-container">
    <van-uploader :before-delete="beforeDel" :multiple="isMultiple" :after-read="afterRead" :accept="accept" :max-count="maxCount" :max-size="maxSize * 1024 * 1024" v-model="fileList" @oversize="onOversize">
      <!-- <img :src="initUrl" alt="" /> -->
    </van-uploader>
  </div>
</template>

<script>
import Vue from 'vue'
import { Uploader, Toast } from 'vant'
Vue.use(Uploader, Toast)
import { getUploadId, postUploadFile } from '@/service/upload'
export default {
  name: 'Upload',
  props: {
    msg: String,
    initUrl: {
      type: Array,
      // 初始图片链接
      default: function () {
        return []
      }
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    // 文件上传大小(默认5M)
    maxSize: {
      type: String,
      default: '5'
    },
    // 文件最多数量
    maxCount: {
      type: String,
      default: '1'
    },
    // 是否公开 1是公开 2是私有
    isPublic: {
      type: String,
      default: '1'
    },
    // 是否分片 1是不分片 2是分片
    isUploadPart: {
      type: String,
      default: '1'
    },
    // 上传接受服务类型
    accept: {
      type: String,
      default: 'image/*'
    }
  },
  data() {
    return {
      fileList: [], //预览文件
      uploadList: [], //上传完成的文件
      uploadId: '', //文件的upload_id
      // width: '500',
      // height: '500',
      suffix: '' //分片上传时必填，文件后缀类型jpg、png、mp3等
    }
  },
  watch: {},
  mounted() {
    if (this.initUrl) {
      if (typeof this.initUrl === 'string') {
        this.fileList.push(this.initUrl)
      } else {
        let newAry = []
        this.initUrl.forEach((element) => {
          let obj = {}
          obj.url = element
          newAry.push(obj)
        })
        this.fileList = newAry
      }
    }
    if (typeof this.initUrl === 'string') {
      this.imageUrl = this.initUrl
      this.fileList.push(this.initUrl)
    } else {
      let newAry = []
      this.initUrl.forEach((element) => {
        let obj = {}
        obj.url = element
        newAry.push(obj)
      })
      this.fileList = newAry
    }
    console.log(this.initUrl, 'initUrl')
    console.log(this.fileList, 'fileList')
  },
  methods: {
    // 文件读取之后
    afterRead(file) {
      // console.log(file, '读取文件')
      let that = this
      let totalLength = parseInt(that.initUrl.length)
      if (Array.isArray(file)) {
        /* eslint-disable */
        // debugger
        for (let i = 0; i < file.length; i++) {
          if (i + totalLength + 1 > this.maxCount) {
            that.fileList.pop()
          } else {
            console.log('进来了', file[i])
            file[i].status = 'uploading'
            file[i].message = '上传中...'
            // 此时可以自行将文件上传至服务器
            // console.log(file, '后')
            let img = new Image()
            img.src = file[i].content
            //压缩图片
            img.onload = function () {
              if (totalLength === 0) {
                that.compressImg(img, i)
              } else {
                that.compressImg(img, totalLength + i)
              }
            }
            file[i].status = 'done'
            file[i].message = '上传完成'
          }
        }
      } else {
        file.status = 'uploading'
        file.message = '上传中...'
        // 此时可以自行将文件上传至服务器
        // console.log(file, '后')
        let img = new Image()
        img.src = file.content
        //压缩图片
        img.onload = function () {
          if (totalLength === 0) {
            that.compressImg(img)
          } else {
            that.compressImg(img, totalLength)
          }
        }
        file.status = 'done'
        file.message = '上传完成'
      }
    },
    /* eslint-disable */
    //压缩图片
    compressImg(img, index = 0) {
      // console.log(img)
      var that = this
      let originWidth = img.width, // 压缩后的宽
        originHeight = img.height,
        maxWidth = 1000,
        maxHeight = 1000, //压缩尺寸
        quality = 0.6, // 压缩质量
        canvas = document.createElement('canvas'),
        drawer = canvas.getContext('2d')
      // console.log(originWidth, originHeight)
      let base64 = ''
      // 判断原图片大小
      if (originWidth > 1000) {
        let targetWidth = maxWidth
        let targetHeight = (1000 * originHeight) / originWidth
        canvas.width = targetWidth
        canvas.height = targetHeight
        drawer.drawImage(img, 0, 0, canvas.width, canvas.height)
        base64 = canvas.toDataURL('image/jpeg', quality) // 压缩后的base64图片
      } else {
        base64 = img.src
      }
      //压缩完成上传图片  base64转blob
      let file = that.dataURLtoBlob(base64)
      // console.log(file, '压缩后file')
      // blob转file
      let aasfile = that.blobToFile(file, 'name')
      // console.log(aasfile, 'aasfile')
      that.getUploadId(aasfile, index)
    },
    // 获得上传uploadId
    getUploadId(file, index) {
      // console.log(file, 'getUploadId', index)
      let that = this
      let type = file.type.split('/')
      // console.log('file', file)
      // console.log(type)
      let suffix = type[type.length - 1]
      // console.log(suffix)
      const param = {
        isPublic: that.isPublic,
        isPart: '2',
        isUploadPart: that.isUploadPart,
        suffix: suffix,
        fileSize: file.size
      }
      getUploadId(param)
        .then(({ data }) => {
          // console.log(data, '上传1')
          that.uploadId = data.uploadId
          that.uploadImg(file, suffix, index)
        })
        .catch(() => {
          Toast('获得文件上传uploadId失败~')
          that.fileList.pop()
        })
    },
    // 上传图片到服务器
    uploadImg(file, suffix, index) {
      // console.log(file, '上传图片到服务器', index)
      let that = this
      let formData = new FormData()
      formData.append('uploadId', that.uploadId)
      formData.append('file', file, `${new Date().getTime()}.${suffix}`)
      postUploadFile(formData)
        .then(({ data }) => {
          file.status = 'done'
          file.message = '上传完成'
          /**
           * 图片上传返回说明
           * 1、如果图片isPublic = 1 是公开图片, 则直接返回fileUrl
           * 2、如果isPublic = 2 是隐私图片 则返回一个对象
           * { bucketName: data.bucketName, keyName: data.uri }
           */
          // 判断是公开图片还是私有
          console.log('data', data)
          if (that.isPublic == 1) {
            that.$set(that.uploadList, index, data.fileUrl)
            // that.uploadList.push(data.fileUrl)
          } else {
            let obj = {
              bucketName: data.bucketName,
              keyName: data.uri
            }
            that.$set(that.uploadList, index, obj)
            // that.uploadList.push(obj)
          }
          this.$emit('imgupload', that.uploadList)
        })
        .catch(() => {
          Toast('文件上传失败')
          that.fileList.pop()
        })
    },
    //将base64转换为blob
    dataURLtoBlob(dataurl) {
      // console.log(dataurl, 'dataurl')
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      // console.log(arr, 'arr')
      // console.log(mime, 'mime')
      return new Blob([u8arr], { type: mime })
    },
    //将blob转换为file
    blobToFile(theBlob, fileName) {
      theBlob.lastModifiedDate = new Date()
      theBlob.name = fileName
      return theBlob
    },
    // 文件超出上传大小限制
    /* eslint-disable */
    onOversize(file) {
      Toast('文件大小不能超过' + this.maxSize + 'M')
    },
    // 文件删除
    beforeDel(file, detail) {
      console.log(file, detail)
      // 删除数组中指定下标元素
      this.uploadList.splice(detail.index, 1)
      this.fileList.splice(detail.index, 1)
      this.$emit('imgupload', this.uploadList)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.upload-container {
}
</style>
