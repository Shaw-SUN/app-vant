import axios from 'axios'
axios({
  method: 'get',
  url: process.env.VUE_APP_BASE_API + '/v4/configs'
}).then((res) => {
  if (res && res.data && res.data.data && res.data.data.index_config && res.data.data.index_config.custom_filter && parseInt(res.data.data.index_config.custom_filter) == 1) {
    let dom = document.createElement('style')
    dom.innerHTML = '.black-filter {  filter: grayscale(1);}'
    document.head.append(dom)
    document.body.classList.add('black-filter')
  }
})
