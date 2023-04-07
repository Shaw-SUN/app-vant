<template>
  <div class="upload-container" :class="{ active: isBorder }">
    <van-uploader :before-read="beforeRead" :before-delete="beforeDel" :multiple="isMultiple" :after-read="afterRead" :accept="accept" :max-count="maxCount" :max-size="maxSize * 1024 * 1024" v-model="fileList" @oversize="onOversize">
      <slot></slot>
    </van-uploader>
  </div>
</template>

<script>
import Vue from 'vue'
import { Uploader, Toast } from 'vant'
Vue.use(Uploader, Toast)
import Compressor from 'compressorjs'
import { getUploadId, postUploadFile } from '@/service/upload'
export default {
  name: 'Upload',
  props: {
    reHealthCodeIndex: Number,
    msg: String,
    initUrl: {
      type: Array,
      // 初始图片链接
      default: function () {
        return []
      }
    },
    isBorder: {
      type: Boolean,
      default: false
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
    // 是否分片 2是不分片 1是分片
    isUploadPart: {
      type: String,
      default: '2'
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
      // uploadId: '', //文件的upload_id
      // width: '500',
      // height: '500',
      suffix: '' //分片上传时必填，文件后缀类型jpg、png、mp3等
    }
  },
  watch: {
    // initUrl(val) {
    //   // 监听传入初始化图片
    //   console.info('watch')
    //   console.info(val)
    //   if (val) {
    //     if (typeof this.initUrl === 'string') {
    //       this.fileList.push(val)
    //     } else {
    //       let newAry = []
    //       val.forEach((element) => {
    //         let obj = {}
    //         obj.url = element
    //         newAry.push(obj)
    //       })
    //       this.fileList = newAry
    //     }
    //   }
    // }
  },
  mounted() {
    if (this.initUrl) {
      let newAry = []
      this.initUrl.forEach((element) => {
        let obj = {}
        obj.url = element
        obj.status = 'done'
        obj.message = '上传完成'
        newAry.push(obj)
      })
      this.fileList = newAry
      this.uploadList = newAry
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
    beforeRead(file) {
      return new Promise((resolve) => {
        // compressorjs 默认开启 checkOrientation 选项
        // 会将图片修正为正确方向
        let fileList = []
        let promiseList = []
        if (Array.isArray(file)) {
          fileList = file
        } else {
          fileList = [file]
        }
        for (let i in fileList) {
          promiseList.push(
            new Promise((resolve2) => {
              new Compressor(fileList[i], {
                quality: 0.7,
                success: resolve2,
                error(err) {
                  console.log(err.message)
                }
              })
            })
          )
        }
        Promise.all(promiseList).then((res) => {
          resolve(res)
        })
      })
    },
    // 文件读取之后
    afterRead(file) {
      let that = this
      let fileList = []
      let totalLength = parseInt(that.fileList.length)
      if (Array.isArray(file)) {
        fileList = file
      } else {
        fileList = [file]
      }
      for (let i in fileList) {
        fileList[i].status = 'uploading'
        fileList[i].message = '上传中...'
        that.getUploadId(fileList[i], parseInt(i) + parseInt(totalLength) - 1)
      }
    },
    // 获得上传uploadId
    getUploadId(file, index) {
      console.log(file, 'getUploadId', index)
      let that = this
      let type = file.file.type.split('/')
      let suffix = type[type.length - 1]
      const param = {
        isPublic: that.isPublic,
        isPart: that.isUploadPart,
        suffix,
        fileSize: file.file.size
      }
      getUploadId(param)
        .then((res) => {
          that.uploadImg(file, suffix, index, res.data.uploadId)
        })
        .catch(() => {
          Toast('文件上传失败')
          that.fileList.splice(index, 1)
        })
    },
    // 上传图片到服务器
    uploadImg(file, suffix, index, uploadId) {
      console.log(file, '上传图片到服务器', index)
      let that = this
      let formData = new FormData()
      formData.append('uploadId', uploadId)
      formData.append('file', file.file, `${new Date().getTime()}.${suffix}`)
      postUploadFile(formData)
        .then((res2) => {
          console.log(res2, '上传2')
          let data = res2.data
          file.status = 'done'
          file.message = '上传完成'
          /**
           * 图片上传返回说明
           * 1、如果图片isPublic = 1 是公开图片, 则直接返回fileUrl
           * 2、如果isPublic = 2 是隐私图片 则返回一个对象
           * { bucketName: data.bucketName, keyName: data.uri }
           */
          // 判断是公开图片还是私有
          if (that.isPublic == 1) {
            that.$set(that.uploadList, index, data.fileUrl)
          } else {
            let obj = {
              url: data.fileUrl
            }
            that.$set(that.uploadList, index, obj)
          }
          if (typeof this.reHealthCodeIndex === 'number') {
            this.$emit('imgupload', { list: that.uploadList, index: this.reHealthCodeIndex })
          } else {
            this.$emit('imgupload', that.uploadList)
          }
        })
        .catch(() => {
          Toast('文件上传失败')
          that.fileList.splice(index, 1)
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
      if (typeof this.reHealthCodeIndex === 'number') {
        this.$emit('imgupload', { list: this.uploadList, index: this.reHealthCodeIndex })
      } else {
        this.$emit('imgupload', this.uploadList)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.upload-container {
  padding:20px 15px 0 0;
  /deep/ .van-image{
    border-radius:16px;
    overflow hidden
  }
  /deep/ .van-uploader__preview-delete{
    width:36px;
    height:36px;
    .van-uploader__preview-delete-icon{
      top:0;
      right:0;
    }
  }
  &.active {
    /deep/ {
      .van-uploader {
        // border: 1px solid #ddd
        .van-uploader__upload {
          border: 1px solid #ddd
          margin: 0
        }
      }
    }
  }
}
</style>
